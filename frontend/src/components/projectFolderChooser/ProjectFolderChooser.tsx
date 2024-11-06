import { Box, Button, TextField } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { GlobalObject } from "../startPage/StartPage";
import axios from "axios";
import Spinner from "../spinner/Spinner";
import { useState } from "react";

const ProjectFolderChooser = ({
    globalObject,
    setGlobalObject,
}: {
    globalObject: GlobalObject;
    setGlobalObject: (globalObject: GlobalObject) => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitPath = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const projectPath = formData.get("projectPath") as string;

        if (!projectPath) return;

        setGlobalObject({ ...globalObject, projectFolderPath: projectPath });

        setIsLoading(true);
        try {
            await axios.post("/setProjectPath", {
                projectPath: projectPath,
            });
            setIsLoading(false);
        } catch (error) {
            console.error("Error setting project path:", error);
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Spinner />}
            <Box
                component="form"
                onSubmit={handleSubmitPath}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: 2,
                }}
            >
                <TextField
                    required
                    fullWidth
                    id="projectPath"
                    name="projectPath"
                    label="SFDX Project Path"
                    placeholder="Enter the full path to your SFDX project"
                    sx={{ maxWidth: "500px" }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<FolderIcon />}
                    sx={{
                        padding: "20px 40px",
                        fontSize: "1.2rem",
                        textTransform: "none",
                    }}
                >
                    Set Project Path
                </Button>
            </Box>
        </>
    );
};

export default ProjectFolderChooser;
