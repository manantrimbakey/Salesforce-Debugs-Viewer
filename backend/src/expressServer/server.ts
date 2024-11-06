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
        });
    });
};

export { startServer };
