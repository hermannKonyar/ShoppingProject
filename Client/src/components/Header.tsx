import {
  AppBar,
  Badge,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { IProducts } from "../model/IProducts";
import { ShoppingCart } from "@mui/icons-material";
import { NavLink } from "react-router";

interface Props {
  products: IProducts[];
}

const links = [
  {
    title: "Home",
    to: "/",
  },
  {
    title: "About",
    to: "/about",
  },
  {
    title: "Contact",
    to: "/contact",
  },
  {
    title: "Catalog",
    to: "/catalog",
  },
  {
    title: "Error",
    to: "/error",
  },
];

const styles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "text.secondary",
  },
};

function Header() {
  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography component={NavLink} to={'/'} variant="h6" sx={styles}>
              E-Commerce
            </Typography>
            <List sx={{ display: "flex" }}>
              {links.map((link) => (
                <ListItem key={link.to} component={NavLink} to={link.to} sx={styles}>
                  <ListItemButton>
                    <ListItemText primary={link.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box>
            <IconButton component={NavLink} to={'/cart'} size="large" sx={{ color: "inherit" }} edge="start">
              <Badge badgeContent={4} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
