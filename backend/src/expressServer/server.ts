import express from "express";
import { findAvailablePortAndSetServerPort } from "./availablePortFinder";
import SFConnecter from "../sfUtils/sfConnecter";
import { logger } from "../utils/logger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
    const port = await findAvailablePortAndSetServerPort();

    if (process.env.NODE_ENV === "development") {
        app.use(express.static("frontend/build"));
    } else {
        app.use(express.static("build/frontend"));
    }

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });

    app.get("/", (req, res) => {
        const root = process.env.NODE_ENV === "development" ? "frontend/build" : "build/frontend";
        res.sendFile("index.html", { root });
    });

    app.post("/setProjectPath", async (req, res) => {
        const projectPath = req.body.projectPath;
        logger.info(`projectPath: ${projectPath}`);
        const isConnected = await SFConnecter.setProjectPath(projectPath);
        res.json({
            isConnected,
            projectPath: SFConnecter.getProjectPath(),
            instanceURL: SFConnecter.getInstanceUrl(),
            username: SFConnecter.getUsername(),
            currentUserId: SFConnecter.getCurrentUserId(),
        });
    });

    app.get("/getLogs", async (req, res) => {
        const logs = await SFConnecter.getLogs();
        res.status(200).json(logs);
    });

    app.get("/getLogInfo/:logId", async (req, res) => {
        logger.info(`getLogInfo: ${req.params.logId}`);
        const logId = req.params.logId;
        const logInfo = await SFConnecter.getLogInfo(logId);
        res.status(200).json(logInfo);
    });

    app.get("/getUsersBySearch/:search", async (req, res) => {
        logger.info(`getUsersBySearch: ${req.params.search}`);
        const search = req.params.search;
        const users = await SFConnecter.getUsersBySearch(search);
        res.status(200).json(users);
    });

    app.post("/setUserId", async (req, res) => {
        if (req?.body?.userId) {
            logger.info(`setUserId: ${req?.body?.userId}`);
            const userId = req?.body?.userId;
            await SFConnecter.setUserId(userId);
        }
        res.status(200).json({ success: true });
    });
};

export { startServer };
