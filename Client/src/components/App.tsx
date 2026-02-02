
import { CssBaseline, Container } from "@mui/material";
import { Outlet } from "react-router";
import Header from "./Header";
function App() {
  
  
  
  return (
    <>
      <CssBaseline />
      <Header  />
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
