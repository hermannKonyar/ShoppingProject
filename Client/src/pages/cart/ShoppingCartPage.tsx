import { useEffect, useState } from "react";
import agent from "../../api/requests";
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ICart } from "../../model/ICart";
import { AddShoppingCart, RemoveShoppingCart } from "@mui/icons-material";
import { useCartContext } from "../../context/CartContext";

export default function ShoppingCartPage() {
    const {cart, setCart} = useCartContext();
    
    
    if (!cart) return <Typography>Cart not found</Typography>;
  return (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Subtotal</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {cart?.items.map((item) => (
                    <TableRow key={item.productId}>
                        <TableCell>
                            <Box display="flex" alignItems="center">
                                <img src={`http://localhost:5094/images/${item.imageUrl}`} alt={item.name} width="50" />
                                <Typography variant="body2" sx={{ ml: 2 }}>{item.name}</Typography>
                            </Box>
                        </TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price * item.quantity}</TableCell>
                        <IconButton>
                            <AddShoppingCart />
                        </IconButton>
                        <IconButton>
                            <RemoveShoppingCart />
                        </IconButton>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>   
  );
}