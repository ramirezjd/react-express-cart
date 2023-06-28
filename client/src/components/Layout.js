import React, { useState, useContext, useEffect } from "react";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavBar from "./NavBar";
import Fab from "@mui/material/Fab";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { blue } from "@mui/material/colors";
import { Drawer, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppContext } from "../App";

const defaultTheme = createTheme({
  palette: {
    primaryLb: {
      main: "#2979ff",
      light: "#5393ff",
      dark: "#1c54b2",
      contrastText: "#fff",
    },
    secondaryLb: {
      main: "#f6f6f6",
    },
    backgroundLb: {
      main: "#f6f6f6",
      light: "#757ce8",
      dark: "#002884",
      contrastText: "#c2608e",
    },
    white: {
      main: "#fff",
    },
  },
});
const fabStyle = {
  position: "absolute",
  bottom: 16,
  right: 16,
};

const fabGreenStyle = {
  color: "common.white",
  bgcolor: blue[500],
  "&:hover": {
    bgcolor: blue[600],
  },
};

function Layout(props) {
  const appContext = useContext(AppContext);
  const [state, setState] = useState(false);
  const [total, setTotal] = useState(0);
  const handleCartDisplay = () => {
    setState((state) => !state);
  };
  const removeCartItem = (index) => {
    const currentCart = [...appContext.appState.cart];
    currentCart.splice(index, 1);
    appContext.setAppState({
      ...appContext.appState,
      cart: currentCart,
    });
    localStorage.setItem("cart", JSON.stringify(currentCart));
  };

  useEffect(() => {
    let total = 0;
    appContext.appState.cart.forEach((element) => {
      total = total + element.product.price * element.qty;
    });
    setTotal(total.toFixed(2));
  }, [appContext.appState.cart]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <NavBar />
      <Container component="main" sx={{ my: { xs: 3, md: 6 }, mb: 4 }}>
        {props.children}
        <React.Fragment>
          <Drawer anchor="left" open={state} onClose={handleCartDisplay}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
              sx={{ px: 3, pt: 3 }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Cart Items
              </Typography>
              {appContext.appState.cart.map((element, index) => {
                return (
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <Typography variant="h6">
                      {element.product.name} (${element.product.price}) x{" "}
                      {element.qty}{" "}
                    </Typography>{" "}
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeCartItem(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}

              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Total: {total}
              </Typography>
            </Stack>
          </Drawer>
        </React.Fragment>
        <Fab
          color="inherit"
          sx={{ ...fabStyle, ...fabGreenStyle }}
          label="Expand"
          onClick={handleCartDisplay}
        >
          <ShoppingCartIcon />
        </Fab>
      </Container>
    </ThemeProvider>
  );
}

export default Layout;
