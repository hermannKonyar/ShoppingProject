import {
  Alert,
  AlertTitle,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import agent from "../api/requests";
import { useState } from "react";

export default function ErrorPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  function getValidationErrors() {
    agent.Errors.getValidationError()
      .then((data) => console.log(data))
      .catch((error) => setValidationErrors(error));
  }
  return (
    <Container>
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((error, index) => (
              <ListItem key={index}>
                <ListItemText primary={error} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
      <Button
        sx={{ mr: 2 }}
        variant="contained"
        onClick={() => agent.Errors.get404Error()}
      >
        Get 404 Error
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant="contained"
        onClick={() => agent.Errors.get401Error()}
      >
        Get 401 Error
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant="contained"
        onClick={() => agent.Errors.get400Error()}
      >
        Get 400 Error
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant="contained"
        onClick={() => agent.Errors.get500Error()}
      >
        Get 500 Error
      </Button>
      <Button sx={{ mr: 2 }} variant="contained" onClick={getValidationErrors}>
        Get Validation Error
      </Button>
    </Container>
  );
}
