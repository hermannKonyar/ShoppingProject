import { CssBaseline, Container } from "@mui/material";
import { Outlet } from "react-router";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useCartContext } from "../context/CartContext";
import agent from "../api/requests";
function App() {
  const { setCart } = useCartContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    agent.Cart.get().then((cart) => setCart(cart)).catch((error) => console.log(error)).finally(() => setLoading(false));
  }, [setCart]);
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
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
