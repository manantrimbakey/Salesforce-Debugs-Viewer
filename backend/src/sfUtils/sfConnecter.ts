import { exec } from "child_process";
import { promisify } from "util";
import { SFDX_GET_USER_INFO_CMD } from "../globalConstants";
// import { logger } from '../utils/logger';
import { removeAnsiCodes } from "../utils/utils";
import { Express, Request, Response } from "express";
import https from "https";
import { IncomingMessage } from "http";

const promisifyExec = promisify(exec);

/**
 * Singleton class to manage Salesforce connection and operations.
 */
class SFConnection {
  private static instance: SFConnection;
  private projectPath: string = "";
  public isConnected: boolean = false;
  private instanceUrl: string = "";
  private username: string = "";
  private authToken: string = "";
  private currentUserId: string = "";
  private readonly logEntryRegex: RegExp =
    /\d+:\d+:\d+\.\d+ \(\d+\)\|CODE_UNIT_STARTED\|\[EXTERNAL\]\|\w+\|(.+)/;
  private restServerPort: number = 0;

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {}

  /**
   * Gets the singleton instance of SFConnection.
   * @returns {SFConnection} The singleton instance of SFConnection.
   */
  public static getInstance(): SFConnection {
    if (!SFConnection.instance) {
      SFConnection.instance = new SFConnection();
    }
    return SFConnection.instance;
  }

  /**
   * Sets the project path and retrieves user information if the path has changed.
   * @param {string} path - The new project path.
   * @returns {Promise<boolean>} True if the user info was successfully retrieved, otherwise false.
   */
  public async setProjectPath(path: string): Promise<boolean> {
    try {
      if (path?.toLowerCase() !== this.projectPath?.toLowerCase()) {
        this.projectPath = path;
        return await this.getUserInfo();
      }
      return this.isConnected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Gets the current project path.
   * @returns {string | null} The current project path or null if not set.
   */
  public getProjectPath(): string | null {
    return this.projectPath;
  }

  /**
   * Retrieves user information from Salesforce.
   * @returns {Promise<boolean>} True if connected successfully, otherwise false.
   */
  private async getUserInfo(): Promise<boolean> {
    const cmd = SFDX_GET_USER_INFO_CMD;

    const { stdout, stderr } = await promisifyExec(cmd, {
      cwd: this.projectPath,
    });
    // logger.info(`userInfoResult=> `, stdout);

    if (stdout) {
      try {
        // const userInfo = JSON.parse(stdout);
        const userInfo = JSON.parse(removeAnsiCodes(stdout));

        this.currentUserId = userInfo?.result?.id;
        this.instanceUrl = userInfo?.result?.instanceUrl;
        this.authToken = userInfo?.result?.accessToken;
        this.username = userInfo?.result?.username;

        this.isConnected = !!(
          this.currentUserId &&
          this.instanceUrl &&
          this.authToken
        );

        // logger.info(`Connected to Salesforce instance: ${this.instanceUrl}`);
        // logger.info(`Current User ID: ${this.currentUserId}`);
        // logger.info(`Auth Token: ${this.authToken}`);
        // logger.info(`Is Connected: ${this.isConnected}`);

        return this.isConnected;
      } catch (parseError) {
        // logger.error('Failed to parse SFDX command output:', parseError);
        return false;
      }
    }

    if (stderr) {
      // logger.error(`Error executing ${cmd}:`, stderr);
    }

    return false;
  }

  /**
   * Destroys the current connection by resetting connection properties.
   */
  public destroyConnection(): void {
    this.isConnected = false;
    this.instanceUrl = "";
    this.authToken = "";
    this.currentUserId = "";
  }

  /**
   * Retrieves logs from Salesforce based on the current user ID.
   * @returns {Promise<any[]>} A promise that resolves to an array of logs.
   */
  public async getLogs(): Promise<unknown[]> {
    const command = `sf data query --query "SELECT Id, LogUser.Name, LogLength, FORMAT(LastModifiedDate) FROM ApexLog WHERE LogUserId='${this.currentUserId}' ORDER BY LastModifiedDate DESC" --json`;
    const options = { cwd: this.projectPath };

    try {
      const { stdout, stderr } = await promisifyExec(command, options);

      if (stderr) {
        // logger.error(`Error executing command ${command}:`, stderr);
      }

      if (stdout) {
        const logs = JSON.parse(removeAnsiCodes(stdout));
        // const logs = JSON.parse(stdout);
        // logger.info(`logs=> `, logs);
        return logs?.result?.records || [];
      }
    } catch (err) {
      // logger.error('Failed to execute command:', err);
    }

    return [];
  }

  /**
   * Sets up an Express route to listen for GET requests for log information.
   *
   * This method defines a route that retrieves the log body for a given log ID.
   * It extracts the log ID from the request parameters, fetches the log body using
   * the `getLogBody` method, and attempts to extract the method name from the log body.
   * The method name is then returned in the response as JSON. If an error occurs during
   * the fetching process, a 500 status code is returned along with an error message.
   *
   * @param {Express} app - The Express application instance to which the route will be added.
   * @returns {void}
   */
  public listenForMinimalLogInfo(app: Express): void {
    app.get("/log/:logid", async (req: Request, res: Response) => {
      const logId = req.params.logid || "";

      try {
        const logBody: string = await this.getLogBody(logId);
        const logEntry = logBody?.match(this.logEntryRegex);
        const methodName = logEntry?.[1] || "NO_METHOD_NAME_FOUND";
        res.json({ methodName });
      } catch (error) {
        console.error("Error fetching log body:", error);
        res.status(500).json({ error: "Failed to fetch log body" });
      }

      res.json({ message: `Log data for ID: ${logId}` });
    });
  }

  /**
   * Retrieves the body of an Apex log from the Salesforce REST API.
   *
   * This method constructs a URL to access the log body for a given log ID,
   * makes an HTTPS GET request to the Salesforce API, and returns the log body
   * as a string. The method handles the response by accumulating data chunks
   * and resolving the promise with the complete log body once the response ends.
   * If the response contains more than 1024 bytes, it will stop receiving data
   * to avoid excessive memory usage.
   *
   * @param {string} logId - The ID of the log whose body is to be retrieved.
   * @returns {Promise<string>} A promise that resolves to the log body as a string.
   * @throws {Error} If there is an error during the HTTPS request.
   */
  private async getLogBody(logId: string): Promise<string> {
    const restApiUrl = `${this.instanceUrl}/services/data/v59.0/sobjects/ApexLog/${logId}/Body`;

    return new Promise((resolve, reject) => {
      let buff = Buffer.alloc(0);
      https
        .get(
          restApiUrl,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          },
          (response: IncomingMessage) => {
            response.on("data", (chunk: Uint8Array) => {
              buff = Buffer.concat([buff, chunk]);
              if (buff.length > 1024) {
                response.destroy();
                return resolve(buff.toString());
              }
            });
            response.on("end", () => {
              resolve(buff.toString());
            });
            response.on("error", (error: Error) => {
              reject(error);
            });
          }
        )
        .on("error", (error: Error) => {
          reject(error);
        });
    });
  }
  /**
   * Retrieves information about a specific log entry from the Salesforce Apex log.
   *
   * This method fetches the log body using the provided log ID, extracts the method name
   * from the log entry using a regular expression, and returns an object containing the method name.
   * If no method name is found, it returns 'NO_METHOD_NAME_FOUND'.
   *
   * @param {string} logId - The ID of the log for which information is to be retrieved.
   * @returns {Promise<{ methodName: string }>} A promise that resolves to an object containing the method name.
   * @throws {Error} If there is an error while fetching the log body.
   */
  public async getLogInfo(logId: string): Promise<unknown> {
    const logBody = await this.getLogBody(logId);
    const logEntry = logBody?.match(this.logEntryRegex);
    const methodName = logEntry?.[1] || "NO_METHOD_NAME_FOUND";
    return { methodName, logId };
  }

  /**
   * Retrieves the instance URL of the Salesforce connection.
   *
   * @returns {string} The instance URL.
   */
  public getInstanceUrl(): string {
    return this.instanceUrl;
  }

  /**
   * Retrieves the REST server port used for the Salesforce connection.
   *
   * @returns {number} The REST server port.
   */
  public getRestServerPort(): number {
    return this.restServerPort;
  }

  /**
   * Sets the REST server port for the Salesforce connection.
   *
   * @param {number} port - The port number to set for the REST server.
   */
  public setRestServerPort(port: number): void {
    this.restServerPort = port;
  }
}

export default SFConnection.getInstance();
