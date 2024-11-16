import { Box, Container, IconButton, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";
import ProjectFolderChooser from "../projectFolderChooser/ProjectFolderChooser";
import LogViewerPage from "../logViewer/LogViewer";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export interface GlobalObject {
    currentScreen: "projectFolderChooser" | "startPage" | "logViewer";
    instanceURL: string;
    username: string;
    projectFolderPath: string | null;
    orgAlias: string;
    isConnected: boolean;
    isDarkMode: boolean;
    currentUserId: string;
}

const StartPage = () => {
    const [globalObject, setGlobalObject] = useState<GlobalObject>({
        currentScreen: "projectFolderChooser",
        instanceURL: "",
        username: "",
        projectFolderPath: null,
        orgAlias: "",
        isConnected: false,
        isDarkMode: false,
        currentUserId: "",
    });

    // Create theme based on isDarkMode
    const theme = createTheme({
        palette: {
            mode: globalObject.isDarkMode ? "dark" : "light",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                <IconButton onClick={() => setGlobalObject((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }))}>
                    {globalObject.isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Box>
            <Container maxWidth="lg" sx={{ height: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
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
        </ThemeProvider>
    );
};

export default StartPage;
