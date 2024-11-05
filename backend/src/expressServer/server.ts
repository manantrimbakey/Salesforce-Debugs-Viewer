import express from "express";
import { findAvailablePortAndSetServerPort } from "./availablePortFinder";
import SFConnecter from "../sfUtils/sfConnecter";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  const port = await findAvailablePortAndSetServerPort();

  app.use(express.static("frontend/build"));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "frontend/build" });
  });

  app.post("/setProjectPath", (req, res) => {
    const projectPath = req.body.projectPath;
    console.log("projectPath", projectPath);
    SFConnecter.setProjectPath(projectPath);
    res.sendStatus(200);
  });
};

export { startServer };
