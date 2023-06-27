import React, { useState, useContext } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppContext } from "../App";
import { Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { baseUrl } from "../config/constants";
import logo from "../images/logo.png";

const defaultTheme = createTheme({
  palette: {
    primaryLb: {
      main: "#2979ff",
      light: "#5393ff",
      dark: "#1c54b2",
      contrastText: "#fff",
    },
    white:{
      main: "#fff",
    }
  },
});

const Login = () => {
  const [state, setState] = useState({
    requesting: false,
    redirect: false,
    error: false,
    message: "",
    username: "",
    password: "",
    errors: {
      username: "",
      password: "",
    },
  });

  
  const validateForm = () => {
    let validForm = true;
    const errors = {
      username: "",
      password: "",
    };
    const keys = Object.keys(errors);
    keys.forEach((key, index) => {
      if(state[key] === "" || state[key].length === 0 ){
        errors[key] = "Required Input";
        validForm = false;
      }
    });
    setState((state) => ({
      ...state,
      errors
    }));
    return validForm;
  }

  const appContext = useContext(AppContext);

  const handleFormSubmit = async (e) => {
    const validate = validateForm();
    if (state.requesting || !validate) {
      return;
    }

    setState((state) => ({
      ...state,
      requesting: true,
      error: false,
    }));

    try {
      const payload = {
        username: state.username,
        password: state.password,
      };
      const loginConfig = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(payload),
      };
      const response = await fetch(
        `${baseUrl}/api/auth/signin`,
        loginConfig
      );
      const responseData = await response.json();
      if (response.ok) {
        appContext.setAppState({
          ...appContext.appState,
          auth: responseData,
          loggedIn: true,
        });
        setState((state) => ({
          ...state,
          requesting: false,
          redirect: true,
        }));
      } else {
        setState((state) => ({
          ...state,
          requesting: false,
          error: true,
          message: responseData?.message ?? "Could not login",
        }));
      }
    } catch (error) {
      console.error(error);
      setState((state) => ({
        ...state,
        requesting: false,
        error: true,
        message: JSON.stringify(error),
      }));
    }
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {state.redirect && <Navigate to="/cart" replace={true} />}
      <Container component="main" maxWidth="xs" sx={{ pt: 2 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={logo} width="35%" alt="Little Bellies Logo" />
          <Typography component="h1" variant="h5" data-cy="loginTitle">
            Log in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              size="small"
              value={state.username}
              margin="normal"
              required
              fullWidth
              id="username"
              data-cy="username"
              label="Username"
              name="username"
              onChange={handleInputChange}
              error= {state.errors.password!==""}
              helperText={ state.errors.password}
            />
            <TextField
              size="small"
              value={state.password}
              margin="normal"
              required
              fullWidth
              name="password"
              data-cy="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleInputChange}
              error= {state.errors.password!==""}
              helperText={ state.errors.password}
            />
            {state.error && <Alert 
              data-cy="errorAlert" severity="error">{state.message}</Alert>}
            <Button
              onClick={handleFormSubmit}
              fullWidth
              data-cy="submitButton"
              variant="contained"
              color="primaryLb"
              sx={{ mt: 3, mb: 2 }}
            >
              {state.requesting && <CircularProgress color="white" size="1.5rem"/>}
              {!state.requesting && <>Sign In</>}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
