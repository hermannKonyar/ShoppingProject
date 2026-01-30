import Product from "./Product";
import { IProducts } from "../model/IProducts";
import { Grid } from "@mui/material";

interface Props {
  products: IProducts[];
}

export default function ProductList(props: Props) {
  return (
    <>
      <Grid container spacing={2}>
        {props.products.map((product: any) => (
          <Grid key={product.id} size={{ xs: 12, md: 4, lg: 3 }}>
            <Product key={product.id} product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
