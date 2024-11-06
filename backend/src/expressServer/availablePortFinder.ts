import { PORT } from "../globalConstants";
import net from "net";
import { logger } from "../utils/logger";

// eslint-disable-next-line prefer-const
let SERVER_PORT = JSON.parse(JSON.stringify(PORT));

const findAvailablePort = async (startPort: number): Promise<number> => {
    const isPortAvailable = (port: number): Promise<boolean> => {
        return new Promise((resolve) => {
            const server = net.createServer();

            server.once("error", () => {
                resolve(false);
            });

            server.once("listening", () => {
                server.close();
                resolve(true);
            });

            server.listen(port);
        });
    };

    let port = startPort;
    while (!(await isPortAvailable(port))) {
        logger.warn(`Port ${port} is in use, trying ${port + 1}`);
        port++;
    }

    return port;
};

const findAvailablePortAndSetServerPort = async () => {
    return await findAvailablePort(SERVER_PORT);
};

export { findAvailablePortAndSetServerPort };
