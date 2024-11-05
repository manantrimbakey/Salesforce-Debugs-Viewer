import { Box, Button } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { GlobalObject } from "../startPage/StartPage";
import axios from "axios";

// Add this interface at the top of the file, after the imports
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    webkitdirectory?: string;
    directory?: string;
    path?: string;
}

const ProjectFolderChooser = ({
    globalObject,
    setGlobalObject,
}: {
    globalObject: GlobalObject;
    setGlobalObject: (globalObject: GlobalObject) => void;
}) => {
    const handleChooseFolder = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("e", JSON.stringify(e.target.files?.[0]));
        const folderPath = e.target.files?.[0]?.webkitRelativePath.split("/")[0];
        setGlobalObject({ ...globalObject, projectFolderPath: folderPath || null });
        // Send project path to backend
        window.dispatchEvent(new CustomEvent("setLoading", { detail: true }));
        if (folderPath) {
            try {
                await axios.post("/setProjectPath", {
                    projectPath: folderPath,
                });
                window.dispatchEvent(new CustomEvent("setLoading", { detail: false }));
            } catch (error) {
                console.error("Error setting project path:", error);
            }
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
            }}
        >
            <input
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                aria-label="Choose project folder"
                {...({ webkitdirectory: "", directory: "" } as CustomInputProps)}
                onChange={handleChooseFolder}
            />
            <label htmlFor="raised-button-file">
                <Button
                    component="span"
                    variant="contained"
                    size="large"
                    startIcon={<FolderIcon />}
                    sx={{
                        padding: "20px 40px",
                        fontSize: "1.2rem",
                        textTransform: "none",
                    }}
                >
                    Choose Project Folder
                </Button>
            </label>
        </Box>
    );
};

export default ProjectFolderChooser;
