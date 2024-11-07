import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Link,
    Grid2 as Grid,
    Typography,
    Button,
    Divider,
} from "@mui/material";
import { ArrowBack, RefreshRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { GlobalObject } from "../startPage/StartPage";
import Spinner from "../spinner/Spinner";
import axios from "axios";
import LogDetailsViewer from "../logDetailsViewer/LogDetailsViewer";

interface Log {
    Id: string;
    LogUser: {
        Name: string;
    };
    LogLength: number;
    LastModifiedDate: string;
}

export default function LogViewerPage({
    globalObject,
    setGlobalObject,
}: Readonly<{
    globalObject: GlobalObject;
    setGlobalObject: (globalObject: GlobalObject) => void;
}>) {
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<Log[]>([]);
    const [refreshCounter, setRefreshCounter] = useState(0);

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get<Log[]>("/getLogs");
                if (response?.status === 200) {
                    setLogs(response.data);
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, [refreshCounter]);

    const handleRefresh = () => {
        setRefreshCounter((prev) => prev + 1);
    };

    return (
        <Box sx={{ height: "100vh", py: 4 }}>
            {isLoading && <Spinner />}

            <Grid direction="row" container sx={{ height: "100%", maxWidth: "100%" }}>
                <Grid size={12}>
                    <Grid spacing={2} container>
                        <Grid>
                            <Typography variant="subtitle2">Project Path:</Typography>
                            <Typography variant="body2">{globalObject.projectFolderPath}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="subtitle2">Instance URL:</Typography>
                            <Typography variant="body2">{globalObject.instanceURL}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="subtitle2">Username:</Typography>
                            <Typography variant="body2">{globalObject.username}</Typography>
                        </Grid>

                        <Grid size="grow" textAlign="right">
                            <Grid container spacing={1} justifyContent="flex-end">
                                <Grid>
                                    <Button variant="contained" onClick={handleRefresh} disabled={isLoading}>
                                        <RefreshRounded />
                                    </Button>
                                </Grid>
                                <Grid>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setGlobalObject({ ...globalObject, currentScreen: "projectFolderChooser" });
                                        }}
                                        disabled={isLoading}
                                    >
                                        <ArrowBack />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid
                    size={12}
                    sx={{ display: "flex", flexDirection: "column", height: "calc(100% - 4rem)", overflow: "auto" }}
                >
                    <TableContainer
                        sx={{ flexGrow: 1, maxHeight: "calc(100% - 1rem)" }}
                        component={Paper}
                        elevation={3}
                    >
                        <Table stickyHeader aria-label="logs table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Log Id</TableCell>
                                    <TableCell>Logged By User</TableCell>
                                    <TableCell>Log Length</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Action</TableCell>
                                    <TableCell>Method Called</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((row) => (
                                    <TableRow key={row.Id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {row.Id}
                                        </TableCell>
                                        <TableCell>{row.LogUser.Name}</TableCell>
                                        <TableCell>{Math.round(row.LogLength / 1024)} KB</TableCell>
                                        <TableCell>{row.LastModifiedDate}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`${globalObject.instanceURL}/servlet/servlet.FileDownload?file=${row.Id}`}
                                                rel="noreferrer"
                                                target="_blank"
                                            >
                                                View
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <LogDetailsViewer logId={row.Id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
}
