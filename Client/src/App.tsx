import { useEffect, useState } from "react";





function App() {
  return (
    <>
      <h1>React Js</h1>
      <Header />
      <ProductList />
    
    </>
  );
}

function Header() {
  return (
    <>
      <h1>Header</h1>
    </>
  );
}


function ProductList() {
  const [products, setProducts] = useState([
  { id: 1, name: "Product 1", price: 100 ,isActive: true},
  { id: 2, name: "Product 2", price: 200 ,isActive: false},
  { id: 3, name: "Product 3", price: 300 ,isActive: true},
]);
const addToCart = ()=>{
  console.log("Add To Cart");
  setProducts([...products,{id:4,name:"Product 4",price:400,isActive:true}])
}
useEffect(()=>{
  fetch("http://localhost:5094/api/products").then(response=>response.json()).then(data=>setProducts(data));
},[])
  return (
    <><>
      <>Product List</>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </><button onClick={addToCart}>Add To Cart</button></>
  );
}

function Footer() {
  return (
    <>
      <h1>Footer</h1>
    </>
  );
}
function Product({ product }: { product: any }) {
  return (
    <>
    {product.isActive && (
      <>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
      </>
      
    )}
    </>
  );
}


export default App;
