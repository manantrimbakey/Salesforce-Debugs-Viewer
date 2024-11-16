import { Backdrop, CircularProgress } from "@mui/material";

const Spinner = () => (
    <Backdrop
        sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1000,
        }}
        open={true}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
);

export default Spinner;
