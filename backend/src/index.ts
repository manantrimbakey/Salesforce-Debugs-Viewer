import { startServer } from "./expressServer/server";
import { logger } from "./utils/logger";

// Log whether Node.js is running in development mode or production
const isDevelopment = process.env.NODE_ENV === "development";
logger.info(`Application running in ${isDevelopment ? "development" : "production"} mode`);

startServer();
