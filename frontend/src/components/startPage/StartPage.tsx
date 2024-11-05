import { Box, Container } from "@mui/material";
import { useState } from "react";
import ProjectFolderChooser from "../projectFolderChooser/ProjectFolderChooser";

export interface GlobalObject {
    currentScreen: "projectFolderChooser" | "startPage";
    instanceURL: string;
    username: string;
    projectFolderPath: string | null;
    orgAlias: string;
}

const StartPage = () => {
    const [globalObject, setGlobalObject] = useState<GlobalObject>({
        currentScreen: "projectFolderChooser",
        instanceURL: "",
        username: "",
        projectFolderPath: null,
        orgAlias: "",
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
            </Box>
        </Container>
    );
};

export default StartPage;
