import { Box, Button, TextField } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { GlobalObject } from "../startPage/StartPage";
import axios from "axios";
import Spinner from "../spinner/Spinner";
import { useState, memo } from "react";

// Move static styles outside component
const formStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 2,
    py: 4,
} as const;

const buttonStyles = {
    padding: "20px 40px",
    fontSize: "1.2rem",
    textTransform: "none",
    width: "500px",
} as const;

const textFieldStyles = {
    width: "500px",
} as const;

const ProjectFolderChooser = memo(({
    globalObject,
    setGlobalObject,
}: {
    globalObject: GlobalObject;
    setGlobalObject: (globalObject: GlobalObject) => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projectPath, setProjectPath] = useState("");

    const handleSubmitPath = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!projectPath.trim()) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post("/setProjectPath", { projectPath });
            
            if (response.data.isConnected) {
                setGlobalObject({
                    ...globalObject,
                    instanceURL: response.data.instanceURL,
                    username: response.data.username,
                    projectFolderPath: response.data.projectPath,
                    currentUserId: response.data.currentUserId,
                    isConnected: true,
                    currentScreen: "logViewer",
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setError(errorMessage);
            console.error("Error setting project path:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Spinner />}
            <Box
                component="form"
                onSubmit={handleSubmitPath}
                sx={formStyles}
            >
                <TextField
                    required
                    fullWidth
                    id="projectPath"
                    name="projectPath"
                    label="SFDX Project Path"
                    placeholder="Enter the full path to your SFDX project"
                    value={projectPath}
                    onChange={(e) => setProjectPath(e.target.value)}
                    error={!!error}
                    helperText={error}
                    sx={textFieldStyles}
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<FolderIcon />}
                    sx={buttonStyles}
                    disabled={isLoading || !projectPath.trim()}
                >
                    {isLoading ? 'Loading...' : 'View Logs!'}
                </Button>
            </Box>
        </>
    );
});

export default ProjectFolderChooser;
