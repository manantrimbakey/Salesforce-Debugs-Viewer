import chalk from "chalk";

/**
 * Logger class implementing singleton pattern for application-wide logging
 * @class Logger
 */
export class Logger {
    private static instance: Logger;
    private logLevel: "debug" | "info" | "warn" | "error" = "debug";
    private enabled: boolean = process.env.NODE_ENV === "development";

    private constructor() {}

    /**
     * Gets the singleton instance of Logger
     * @returns {Logger} The Logger instance
     */
    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Sets the minimum log level
     * @param {('debug'|'info'|'warn'|'error')} level - The minimum level to log
     */
    setLogLevel(level: "debug" | "info" | "warn" | "error"): void {
        this.logLevel = level;
    }

    /**
     * Enables logging
     */
    enable(): void {
        this.enabled = true;
    }

    /**
     * Disables logging
     */
    disable(): void {
        this.enabled = false;
    }

    /**
     * Checks if logging is enabled
     * @returns {boolean} True if logging is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Logs a debug message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    debug(message: string, ...args: unknown[]): void {
        if (this.enabled && this.shouldLog("debug")) {
            console.debug(chalk.green(`[DEBUG] ${message}`), ...args);
        }
    }

    /**
     * Logs an info message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    info(message: string, ...args: unknown[]): void {
        if (this.enabled && this.shouldLog("info")) {
            console.info(chalk.blue(`[INFO] ${message}`), ...args);
        }
    }

    /**
     * Logs a warning message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    warn(message: string, ...args: unknown[]): void {
        if (this.enabled && this.shouldLog("warn")) {
            console.warn(chalk.yellow(`[WARN] ${message}`), ...args);
        }
    }

    /**
     * Logs an error message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    error(message: string, ...args: unknown[]): void {
        if (this.enabled && this.shouldLog("error")) {
            console.error(chalk.red(`[ERROR] ${message}`), ...args);
        }
    }

    /**
     * Determines if a message of the given level should be logged
     * @param {('debug'|'info'|'warn'|'error')} level - The level to check
     * @returns {boolean} True if the message should be logged
     * @private
     */
    private shouldLog(level: "debug" | "info" | "warn" | "error"): boolean {
        const levels = ["debug", "info", "warn", "error"];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
}

// Export a default logger instance
export const logger = Logger.getInstance();
