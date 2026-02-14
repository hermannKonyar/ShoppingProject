import { Card, Container, Divider, Typography } from "@mui/material";
import { useLocation } from "react-router";

export default function ServerError() {
  const { state } = useLocation();
  return (
    <>
      <Container component={Card} sx={{p:3}}>
        {state?.error ? (
          <>
            <Typography variant="h4" gutterBottom>
              {state.error.title}
            </Typography>

            <Divider />
            <Typography variant="body1" gutterBottom>
              {state.error.detail || "Internal server error"}
            </Typography>
          </>
        ) : (
          <Typography variant="h4">Server Error</Typography>
        )}
      </Container>
    </>
  );
}
