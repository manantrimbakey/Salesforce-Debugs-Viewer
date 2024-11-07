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
} from "@mui/material";
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
}: {
    globalObject: GlobalObject;
    setGlobalObject: (globalObject: GlobalObject) => void;
}) {
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

    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
            }}
        >
            {isLoading && <Spinner />}
            <TableContainer sx={{ maxHeight: "calc(100vh - 5rem)" }} component={Paper}>
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
        </Box>
    );
}
