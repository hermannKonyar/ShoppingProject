import { Button, Container } from "@mui/material";
import agent from "../api/requests";

 export default function ErrorPage() {
    return (
        <Container>
            <Button sx={{mr:2}} variant="contained" onClick={() => agent.Errors.get404Error()}>
                Get 404 Error
            </Button>
            <Button sx={{mr:2}} variant="contained" onClick={() => agent.Errors.get401Error()}>
                Get 401 Error
            </Button>
            <Button sx={{mr:2}} variant="contained" onClick={() => agent.Errors.get400Error()}>
                Get 400 Error
            </Button>
            <Button sx={{mr:2}} variant="contained" onClick={() => agent.Errors.get500Error()}>
                Get 500 Error
            </Button>
            <Button sx={{mr:2}} variant="contained" onClick={() => agent.Errors.getValidationError()}>
                Get Validation Error
            </Button>
        </Container>
    );
}