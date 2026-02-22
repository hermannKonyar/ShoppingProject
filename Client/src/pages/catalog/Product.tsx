import { AddShoppingCart, Search } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { Link } from "react-router";
import agent from "../../api/requests";
import { useState } from "react";

function Product({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);
  const handleAddItem = (productId: number) => {
    setLoading(true);
    agent.Cart.addItem(productId, 1)
      .then((cart) => console.log(cart))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };
  return (
    <>
      <Card>
        <CardMedia
          sx={{ height: 140, backgroundSize: "contain" }}
          image={`http://localhost:5094/images/${product.imageUrl}`}
          title={product.name}
        />
        <CardContent>
          <Typography variant="h6" component="h2" color="text.secondary">
            {product.name}
          </Typography>
          <Typography variant="body2" component="h2" color="secondary">
            {product.price.toFixed(2)} TL
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            loading={loading}
            variant="outlined"
            size="small"
            startIcon={<AddShoppingCart color="success" />}
            onClick={() => handleAddItem(product.id)}
          >
            Add to Cart
          </Button>
          <Button
            component={Link}
            to={`/catalog/${product.id}`}
            variant="outlined"
            size="small"
            startIcon={<Search />}
            color="primary"
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default Product;
