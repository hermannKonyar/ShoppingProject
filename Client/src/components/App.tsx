import { useEffect, useState } from "react";
import { IProducts } from "../model/IProducts";
import Header from "./Header";
import ProductList from "./ProductList";
import ButtonUsage from "./ButtonUsage";
import { CssBaseline, Container } from "@mui/material";
function App() {
  const [products, setProducts] = useState<IProducts[]>([]);
  
  useEffect(() => {
    fetch("http://localhost:5094/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);
  return (
    <>
      <CssBaseline />
      <Header  />
      <Container>
      <ProductList products={products}  />
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
