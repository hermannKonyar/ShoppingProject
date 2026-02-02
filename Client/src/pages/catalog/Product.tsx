import { AddShoppingCart, Search} from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";

function Product({ product }: { product: any }) {
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
          <Button variant="outlined" size="small" startIcon={<AddShoppingCart  color="success" />}>Add to Cart</Button>
          <Button variant="outlined" size="small" startIcon={<Search />} color="primary">View Details</Button>
        </CardActions>
      </Card>
    </>
  );
}

export default Product;
