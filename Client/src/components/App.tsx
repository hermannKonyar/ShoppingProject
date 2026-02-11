import { CssBaseline, Container } from "@mui/material";
import { Outlet } from "react-router";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <ToastContainer  position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

function Footer() {
  return (
    <>
      <h1>Footer</h1>
    </>
  );
}

export default App;
