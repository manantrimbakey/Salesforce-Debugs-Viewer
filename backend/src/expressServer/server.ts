import express from "express";
import { findAvailablePortAndSetServerPort } from "./availablePortFinder";
import SFConnecter from "../sfUtils/sfConnecter";
import { logger } from "../utils/logger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
    const port = await findAvailablePortAndSetServerPort();

    app.use(express.static("frontend/build"));

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });

    app.get("/", (req, res) => {
        res.sendFile("index.html", { root: "frontend/build" });
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
        });
    });

    app.get("/getLogs", async (req, res) => {
        const logs = await SFConnecter.getLogs();
        res.status(200).json(logs);
    });

    app.get("/getLogInfo/:logId", async (req, res) => {
        const logId = req.params.logId;
        const logInfo = await SFConnecter.getLogInfo(logId);
        res.status(200).json(logInfo);
    });
};

export { startServer };
