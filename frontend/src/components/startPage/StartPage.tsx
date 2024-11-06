import { Box, Container } from "@mui/material";
import { useState } from "react";
import ProjectFolderChooser from "../projectFolderChooser/ProjectFolderChooser";
import LogViewerPage from "../logViewer/LogViewer";

export interface GlobalObject {
    currentScreen: "projectFolderChooser" | "startPage" | "logViewer";
    instanceURL: string;
    username: string;
    projectFolderPath: string | null;
    orgAlias: string;
    isConnected: boolean;
}

const StartPage = () => {
    const [globalObject, setGlobalObject] = useState<GlobalObject>({
        currentScreen: "projectFolderChooser",
        instanceURL: "",
        username: "",
        projectFolderPath: null,
        orgAlias: "",
        isConnected: false,
    });

    return (
        <Container maxWidth="lg" sx={{ height: "100%", py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                {globalObject.currentScreen === "projectFolderChooser" && (
                    <ProjectFolderChooser globalObject={globalObject} setGlobalObject={setGlobalObject} />
                )}
                {globalObject.currentScreen === "logViewer" && (
                    <LogViewerPage globalObject={globalObject} setGlobalObject={setGlobalObject} />
                )}
            </Box>
        </Container>
    );
};

export default StartPage;
