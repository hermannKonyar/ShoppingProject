import { useEffect, useState } from "react";
import agent from "../../api/requests";
import {
    Alert,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ICart } from "../../model/ICart";
import {
  AddCircleOutline,
  AddShoppingCart,
  RemoveCircleOutline,
  RemoveShoppingCart,
} from "@mui/icons-material";
import { useCartContext } from "../../context/CartContext";
import { LoadingButton } from "@mui/lab";

export default function ShoppingCartPage() {
  const { cart, setCart } = useCartContext();
  const [loading, setLoading] = useState(true);

  function handleAddItem(productId: number, quantity = 1) {
    setLoading(true);
    agent.Cart.addItem(productId, quantity)
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function handleDeleteItem(productId: number, quantity = 1) {
    setLoading(true);
    agent.Cart.deleteItem(productId, quantity)
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    agent.Cart.get()
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [setCart]);

  if (cart?.items.length === 0) return <Alert severity="info">Your cart is empty</Alert>;
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
                  <img
                    src={`http://localhost:5094/images/${item.imageUrl}`}
                    alt={item.name}
                    width="50"
                  />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {item.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{item.price}</TableCell>

              <TableCell>
                <LoadingButton
                  loading={loading}
                  onClick={() => handleDeleteItem(item.productId)}
                >
                  <RemoveCircleOutline />
                </LoadingButton>
                {item.quantity}
                <LoadingButton
                  loading={loading}
                  onClick={() => handleAddItem(item.productId)}
                >
                  <AddCircleOutline />
                </LoadingButton>
              </TableCell>

              <TableCell align="right">{item.price * item.quantity}</TableCell>

              <TableCell align="right">
                <LoadingButton
                  color="error"
                  loading={loading}
                  onClick={() =>
                    handleDeleteItem(item.productId, item.quantity)
                  }
                >
                  <RemoveShoppingCart />
                </LoadingButton>
                <LoadingButton
                  color="error"
                  loading={loading}
                  onClick={() => handleAddItem(item.productId)}
                >
                  <AddShoppingCart />
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
