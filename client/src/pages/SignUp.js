import React, { useState, useContext } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Grid, Link, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppContext } from "../App";
import CircularProgress from "@mui/material/CircularProgress";
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
    white: {
      main: "#fff",
    },
  },
});

const SignUp = () => {
  const [state, setState] = useState({
    requesting: false,
    redirect: false,
    error: false,
    success: false,
    message: "",
    username: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    email: "",
    errors: {
      username: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const validateForm = () => {
    let validForm = true;
    const errors = {
      username: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
      email: "",
    };
    if (state.password !== state.passwordConfirm) {
      errors.passwordConfirm = "Passwords mismatch";
      validForm = false;
    }
    const keys = Object.keys(errors);
    keys.forEach((key, index) => {
      if (state[key] === "" || state[key].length === 0) {
        errors[key] = "Required Input";
        validForm = false;
      }
    });
    setState((state) => ({
      ...state,
      errors,
    }));
    return validForm;
  };

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
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
      };
      const signUpConfig = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(payload),
      };
      const response = await fetch(`${baseUrl}/api/auth/signup`, signUpConfig);
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
          error: false,
          success: true,
          message: responseData?.message ?? "User was successfuly registered",
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
      <Container component="main" maxWidth="xs" sx={{ pt: 2, mb:5 }}>
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
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", mt: 2 }}
            data-cy="loginTitle"
          >
            Sign Up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1.5}
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
                  value={state.firstName}
                  required
                  id="firstName"
                  data-cy="firstName"
                  label="First Name"
                  name="firstName"
                  onChange={handleInputChange}
                  error={state.errors.firstName !== ""}
                  helperText={state.errors.firstName}
                />
                <TextField
                  size="small"
                  value={state.lastName}
                  required
                  id="lastName"
                  data-cy="lastName"
                  label="Last Name"
                  name="lastName"
                  onChange={handleInputChange}
                  error={state.errors.lastName !== ""}
                  helperText={state.errors.lastName}
                />
              </Stack>
              <TextField
                size="small"
                value={state.username}
                required
                fullWidth
                id="username"
                data-cy="username"
                label="Username"
                name="username"
                onChange={handleInputChange}
                error={state.errors.password !== ""}
                helperText={state.errors.password}
              />
              <TextField
                size="small"
                value={state.email}
                required
                fullWidth
                name="email"
                data-cy="email"
                label="Email"
                type="email"
                id="email"
                onChange={handleInputChange}
                error={state.errors.email !== ""}
                helperText={state.errors.email}
              />
              <TextField
                size="small"
                value={state.password}
                required
                fullWidth
                name="password"
                data-cy="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleInputChange}
                error={state.errors.password !== ""}
                helperText={state.errors.password}
              />
              <TextField
                size="small"
                value={state.passwordConfirm}
                required
                fullWidth
                name="passwordConfirm"
                data-cy="passwordConfirm"
                label="Password Confirm"
                type="password"
                id="passwordConfirm"
                onChange={handleInputChange}
                error={state.errors.passwordConfirm !== ""}
                helperText={state.errors.passwordConfirm}
              />
            </Stack>
            {state.error && (
              <Alert data-cy="errorAlert" severity="error">
                {state.message}
              </Alert>
            )}
            {state.success && (
              <Alert data-cy="successAlert" severity="success">
                {state.message}
              </Alert>
            )}
            <Button
              onClick={handleFormSubmit}
              fullWidth
              data-cy="submitButton"
              variant="contained"
              color="primaryLb"
              sx={{ mt: 3, mb: 2 }}
            >
              {state.requesting && (
                <CircularProgress color="white" size="1.5rem" />
              )}
              {!state.requesting && <>Sign In</>}
            </Button>
          </Box>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
