import React, { useState, useEffect, useContext } from "react";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AppContext } from "../App";
import { baseUrl } from "../config/constants";
import { Stack } from "@mui/material";

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
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableHead = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#2979ff",
}));

const Cart = () => {
  const initialState = {
    requesting: false,
    error: false,
    message: "",
    products: [],
  };
  const [state, setState] = useState(initialState);
  const appContext = useContext(AppContext);
  useEffect(() => {
    async function getProductsList() {
      if (state.requesting) {
        return;
      }
      setState((state) => ({
        ...state,
        requesting: true,
      }));
      try {
        const getImageConfig = {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
        const response = await fetch(
          `${baseUrl}/api/products/`,
          getImageConfig
        );
        const responseData = await response.json();
        if (response.ok) {
          responseData.forEach((element) => {
            element.orderQty = 0;
          });
          setState((state) => ({
            ...state,
            requesting: false,
            products: responseData,
          }));
        } else {
          setState((state) => ({
            ...state,
            requesting: false,
            error: true,
            message: responseData?.error?.message ?? "Error getting the list",
            products: [],
          }));
        }
      } catch (error) {
        console.error(error.message ?? JSON.stringify(error));
        setState((state) => ({
          ...state,
          requesting: false,
          error: true,
          message: error.message ?? JSON.stringify(error),
          products: [],
        }));
      }
    }
    getProductsList();
  }, []);

  const addItemToCart = (index, qty) => {
    if(qty === 0){
      return;
    }
    const currentCart = [...appContext.appState.cart];
    const product = state.products[index];
    const cartItem = {
      product,
      qty
    };
    currentCart.push(cartItem);
    appContext.setAppState({
      ...appContext.appState,
      cart: currentCart,
    });
    localStorage.setItem('cart', JSON.stringify(currentCart));
  }

  const handleQtyChange = (event, index) => {
    const products = [...state.products];
    products[index].orderQty = event.target.value;

    setState((state) => ({
      ...state,
      products
    }));
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{
          fontWeight: "bold",
          color: "#2979ff",
        }}
        data-cy="mainTitle"
      >
        Generic Product List Page
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ mt: 1, textAlign: "right" }}>
          Here goes the filters
        </Grid>
        <Grid item xs={12}>
          <TableContainer
            className="tableComponent"
            component={Paper}
            sx={{ minWidth: 1 }}
          >
            <Table sx={{ minWidth: 1 }}>
              <TableHead>
                <StyledTableHead theme={defaultTheme}>
                  <TableCell
                    sx={{
                      py: 1,
                      px: 0.5,
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    Product{" "}
                  </TableCell>
                  <TableCell
                    sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                  >
                    Available
                  </TableCell>
                  <TableCell
                    sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                  >
                    Actions
                  </TableCell>
                </StyledTableHead>
              </TableHead>
              {state.requesting && (
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      scope="row"
                      colSpan={7}
                      align="center"
                      component="th"
                    >
                      <CircularProgress size="1.5rem" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}

              {!state.requesting && (
                <>
                  {state.products.length === 0 && (
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          scope="row"
                          colSpan={7}
                          align="center"
                          component="th"
                        >
                          THERE ARE NO REGISTRIES TO SHOW
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                  {state.products.length > 0 && (
                    <TableBody>
                      {state.products.map((row, index) => (
                        <StyledTableRow
                          key={row.id}
                          data-cy={"row-" + index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell sx={{ p: 0.5 }}>{row.name}</TableCell>
                          <TableCell sx={{ py: 0.5, fontWeight: "bold" }}>
                            {row.price}
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>{row.stock}</TableCell>
                          <TableCell sx={{ py: 0.5 }}>
                            {row.categories[0].name}
                          </TableCell>

                          <TableCell
                            sx={{
                              py: 0.5,
                              maxWidth: "200px",
                              textOverflow: "ellipsis",
                              wordBreak: "break-all",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              spacing={1}
                              sx={{ mt: 2 }}
                            >
                              <TextField
                                size="small"
                                id="outlined-number"
                                label="Add Qty"
                                type="number"
                                value={row.orderQty}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{
                                  min: "0"
                                }}
                                sx={{
                                  py: 1,
                                  maxWidth: "90px",
                                }}
                                onChange={(event) => handleQtyChange(event, index)}
                              />
                              <Button
                                size="small"
                                onClick={() => {
                                  addItemToCart(index, row.orderQty);
                                }}
                                variant="contained"
                                className="submitButton"
                                color="primaryLb"
                              >
                                ADD
                              </Button>
                            </Stack>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  )}
                </>
              )}
            </Table>
          </TableContainer>
        </Grid>
        {state.error && (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mt: 2 }}>
              {state.message}
            </Alert>
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default Cart;
