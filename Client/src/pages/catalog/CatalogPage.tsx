import { useEffect, useState } from "react";
import { IProducts } from "../../model/IProducts";
import ProductList from "./ProductList";
export default function CatalogPage() {
  const [products, setProducts] = useState<IProducts[]>([]);
  useEffect(() => {
    fetch("http://localhost:5094/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <>
      <ProductList products={products} />
    </>
  );
}
