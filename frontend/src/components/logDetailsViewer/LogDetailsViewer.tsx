// import axios from 'axios';
import { useEffect, useRef, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
// import { ipcCallSendMessage } from '../IpcCaller/IpcCaller';
// import { GET_LOG_BODY_CHANNEL } from '../../../global_constants';
export default function LogDetailsViewer({ logId }: Readonly<{ logId: string }>) {
    let initialized = useRef(false);
    const [methodName, setMethodName] = useState("");

    // Cache the fetchLogSnippet function
    const fetchLogSnippet = useMemo(
        () => async () => {
            const cacheKey = `log_${logId}`;
            const cachedData = sessionStorage.getItem(cacheKey);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setMethodName(parsedData.methodName || "");
            } else {
                const response = await axios.get(`/getLogInfo/${logId}`);
                if (response?.status === 200 && response?.data) {
                    setMethodName(response.data.methodName);

                    // Cache the data in sessionStorage
                    sessionStorage.setItem(cacheKey, JSON.stringify({ methodName: response.data.methodName }));
                }
            }
        },
        [logId]
    );

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            fetchLogSnippet();
        }
    }, [logId]);

    // const tableSize

    return <>{methodName || <CircularProgress size={20} />}</>;
}
