import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IProducts } from "../../model/IProducts";

export default function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState<IProducts | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        fetch(`http://localhost:5094/api/products/${id}`)
        .then(response => response.json())
        .then(data => setProduct(data))
        .catch(error => console.log(error)).finally(()=>{
            setLoading(false);
        })  
    },[id]);
    if(loading) return <h1>Loading...</h1>;
    if(!product) return <h1>Product not found</h1>;
    return (
        <>
        <Typography variant="h3">{product.name}</Typography>
        <Typography variant="h3">{product.price.toFixed(2)}</Typography>
        </>
    );
}