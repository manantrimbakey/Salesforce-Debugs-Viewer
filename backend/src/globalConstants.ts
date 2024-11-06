const PORT = 4000;

const OPEN_DIRECTORY_CHANNEL = "open-directory";
const IPC_EXAMPLE_CHANNEL = "ipc-example";
const SFDX_AUTH_CHANNEL = "sfdx-auth";
const GET_LOGS_CHANNEL = "get-logs";
const SFDX_GET_USER_INFO_CMD = "sf org display user --json";
const LOG_DOWNLOADER_URL = "/servlet/servlet.FileDownload?file=";
const GET_LOG_BODY_CHANNEL = "get-log-body";

export {
    OPEN_DIRECTORY_CHANNEL,
    IPC_EXAMPLE_CHANNEL,
    SFDX_AUTH_CHANNEL,
    SFDX_GET_USER_INFO_CMD,
    GET_LOGS_CHANNEL,
    LOG_DOWNLOADER_URL,
    GET_LOG_BODY_CHANNEL,
    PORT,
};
