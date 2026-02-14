import {
  Button,
  Card,
  Container,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router";

export default function NotFound() {
  return (
    <>
      <Container component={Card} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Not Found
        </Typography>
        <Divider />
        <Button variant="contained" component={NavLink} to="/catalog">
          Return to Catalog
        </Button>
      </Container>
    </>
  );
}
