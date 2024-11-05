import { Box, Container, Backdrop, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import ProjectFolderChooser from "../projectFolderChooser/ProjectFolderChooser";

// Add loading control function
export const setLoading = (isLoading: boolean) => {
    window.dispatchEvent(new CustomEvent("setLoading", { detail: isLoading }));
};

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

    // Separate loading state
    const [isLoading, setIsLoading] = useState(false);

    // Add event listener setup
    useEffect(() => {
        const handleLoading = (event: CustomEvent) => {
            setIsLoading(event.detail);
        };

        window.addEventListener("setLoading" as any, handleLoading);
        return () => window.removeEventListener("setLoading" as any, handleLoading);
    }, []);

    return (
        <>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

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
        </>
    );
};

export default StartPage;
