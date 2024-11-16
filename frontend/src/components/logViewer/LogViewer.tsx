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
    Autocomplete,
    TextField,
    CircularProgress,
    Button,
} from "@mui/material";
import { ArrowBack, RefreshRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { GlobalObject } from "../startPage/StartPage";
import Spinner from "../spinner/Spinner";
import axios from "axios";
import LogDetailsViewer from "../logDetailsViewer/LogDetailsViewer";

interface User {
    Id: string;
    Name: string;
    Username: string;
}
interface Log {
    Id: string;
    LogUser: {
        Name: string;
    };
    LogLength: number;
    LastModifiedDate: string;
}

function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
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
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleOpen = () => {
        setOpen(true);
        (async () => {
            setLoading(true);
            // await sleep(1e3); // For demo purposes.

            setOptions([...options]);
            setLoading(false);
        })();
    };

    const handleClose = () => {
        setOpen(false);
        // setOptions([]);
    };
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

    useEffect(() => {
        fetchLogs();
    }, [refreshCounter]);

    const handleRefresh = () => {
        setRefreshCounter((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (inputValue?.trim()?.length >= 3) {
                setLoading(true);
                try {
                    const response = await axios.get(`/getUsersBySearch/${inputValue}`);
                    setOptions(response.data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setOptions([]);
            }
        };

        const timeoutId = setTimeout(fetchUsers, 1000);
        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    return (
        <Box sx={{ height: "100vh", py: 4 }}>
            {isLoading && <Spinner />}

            <Grid direction="row" container sx={{ height: "100%", maxWidth: "100%" }}>
                <Grid size={12}>
                    <Grid container spacing={2}>
                        <Grid>
                            <Typography variant="subtitle2">Instance URL:</Typography>
                            <Typography variant="body2">{globalObject.instanceURL}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="subtitle2">Username:</Typography>
                            <Typography variant="body2">{globalObject.username}</Typography>
                        </Grid>
                        <Grid size="grow">
                            <Autocomplete
                                fullWidth
                                open={open}
                                onOpen={handleOpen}
                                onClose={handleClose}
                                getOptionLabel={(option) => option.Name}
                                options={options}
                                loading={loading}
                                value={selectedUser}
                                onChange={async (event, newValue: User | null) => {
                                    if (newValue) {
                                        setIsLoading(true);
                                        await axios.post("/setUserId", { userId: newValue?.Id });
                                        await fetchLogs();
                                        setSelectedUser(newValue);
                                        setIsLoading(false);
                                    } else {
                                        setSelectedUser(null);
                                    }
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Search Users"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loading ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid textAlign="right" alignContent="center">
                            <Grid sx={{ height: "100%" }} container spacing={1} justifyContent="flex-end">
                                <Grid>
                                    <Button
                                        variant="contained"
                                        onClick={handleRefresh}
                                        disabled={isLoading}
                                        disableElevation
                                        sx={{ height: "100%" }}
                                    >
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
                                        disableElevation
                                        sx={{ height: "100%" }}
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
