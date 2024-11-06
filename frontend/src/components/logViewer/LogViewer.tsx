import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Grid2 as Grid,
    Link,
    CircularProgress,
} from "@mui/material";
import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { GlobalObject } from "../startPage/StartPage";
import Spinner from "../spinner/Spinner";
import axios from "axios";
import LogDetailsViewer from "../logDetailsViewer/LogDetailsViewer";
// import { ipcCallSendMessage } from '../IpcCaller/IpcCaller';
// import { GET_LOGS_CHANNEL, LOG_DOWNLOADER_URL } from '../../../global_constants';
// import LogDetailsDownloader from '../LogDetailsDownloader/LogDetailsDownloader';

export default function LogViewerPage({
    globalObject,
    setGlobalObject,
}: {
    globalObject: GlobalObject;
    setGlobalObject: (globalObject: GlobalObject) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [refreshCounter, setRefreshCounter] = useState<number>(0);

    useEffect(() => {
        init();
    }, [refreshCounter]);

    const init = async () => {
        setIsLoading(true);
        await fetchLogs();
        setIsLoading(false);
    };

    const fetchLogs = async () => {
        const response = await axios.get("/getLogs");
        if (response?.status === 200 && response?.data) {
            setLogs(response.data);
            return true;
        } else {
            return false;
        }
    };

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
                <Table stickyHeader aria-label="simple table">
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
                        {logs?.map(
                            (row: {
                                Id: string;
                                LogUser: {
                                    Name: string;
                                };
                                LogLength: number;
                                LastModifiedDate: string;
                            }) => (
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
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
