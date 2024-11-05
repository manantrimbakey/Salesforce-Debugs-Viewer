import { Container } from "@mui/material";
import StartPage from "./components/startPage/StartPage";
function App() {
    return (
        <Container maxWidth={false} sx={{ height: "100%" }}>
            <StartPage />
        </Container>
    );
}

export default App;
