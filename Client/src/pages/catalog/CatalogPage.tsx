import { useEffect, useState } from "react";
import { IProducts } from "../../model/IProducts";
import ProductList from "./ProductList";
import { CircularProgress } from "@mui/material";
import agent from "../../api/requests";
export default function CatalogPage() {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    agent.Catalog.list()
      .then((data) => setProducts(data))
      .finally(()=>{
        setLoading(false);
      });
  }, []);

  if(loading) return <CircularProgress/>;

  return (
    <>
      <ProductList products={products} />
    </>
  );
}
