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
    Alert,
} from "@mui/material";
import { ArrowBack, RefreshRounded } from "@mui/icons-material";
import { useEffect, useState, useCallback, useMemo } from "react";
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

export default function LogViewerPage({
    globalObject,
    setGlobalObject,
}: Readonly<{
    globalObject: GlobalObject;
    setGlobalObject: (globalObject: GlobalObject) => void;
}>) {
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<Log[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [options, setOptions] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get<Log[]>("/getLogs");
            setLogs(response.data);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch logs";
            setError(message);
            console.error("Error fetching logs:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleUserSearch = useCallback(async (searchValue: string) => {
        if (searchValue?.trim()?.length >= 3) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/getUsersBySearch/${searchValue}`);
                setOptions(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setOptions([]);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => handleUserSearch(inputValue), 1000);
        return () => clearTimeout(timeoutId);
    }, [inputValue, handleUserSearch]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleUserChange = useCallback(
        async (newValue: User | null) => {
            if (newValue) {
                setIsLoading(true);
                try {
                    await axios.post("/setUserId", { userId: newValue?.Id });
                    await fetchLogs();
                    setSelectedUser(newValue);
                } catch (error) {
                    setError("Failed to update user");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSelectedUser(null);
            }
        },
        [fetchLogs]
    );

    const LogsTable = useMemo(
        () => (
            <TableContainer sx={{ flexGrow: 1, maxHeight: "calc(100% - 1rem)" }} component={Paper} elevation={3}>
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
        ),
        [logs, globalObject.instanceURL, globalObject.currentUserId]
    );

    return (
        <Box sx={{ height: "100vh", py: 4 }}>
            {isLoading && <Spinner />}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

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
                                getOptionLabel={(option) => option.Name}
                                options={options}
                                loading={isLoading}
                                value={selectedUser}
                                onChange={(event, newValue) => handleUserChange(newValue)}
                                onInputChange={(event, newValue) => setInputValue(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Search Users"
                                        error={!!error}
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading ? (
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
                                        onClick={fetchLogs}
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
                    {LogsTable}
                </Grid>
            </Grid>
        </Box>
    );
}
