import React, { useState, useEffect, createContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import NoMatch from "./pages/NoMatch";
import Layout from "./components/Layout";
import RootErrorBoundary, { Fallback } from "./pages/RootErrorBoundary";

const initialAppState = {
  loggedIn: false,
  auth: {
    id: "",
    username: "",
    email: "",
    roles: "",
  },
  cart: [],
  status: "idle",
};

export const AppContext = createContext(initialAppState);
function App() {
  const [appState, setAppState] = useState(initialAppState);
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart"));
    if (localCart) {
      setAppState({
        ...appState,
        cart: localCart
      });
    }
  }, [appState.loggedIn]);
  let router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" replace={true} />,
    },
    {
      path: "login",
      element: <Login />,
      errorElement: <RootErrorBoundary />,
    },
    {
      path: "sign-up",
      element: <SignUp />,
      errorElement: <RootErrorBoundary />,
    },
    {
      path: "shop",
      element: (appState?.loggedIn ?? false) ? (
        <Layout>
          <Cart />
        </Layout>
      ) : (
        <Navigate to="/login" replace={true} />
      ),
      errorElement: <RootErrorBoundary />,
    },
    {
      path: "categories",
      element: (appState?.loggedIn ?? false) ? (
        <Layout>
          <Categories />
        </Layout>
      ) : (
        <Navigate to="/login" replace={true} />
      ),
      errorElement: <RootErrorBoundary />,
    },
    {
      path: "*",
      element: <NoMatch />,
      errorElement: <RootErrorBoundary />,
    },
  ]);
  return (
    <AppContext.Provider value={{ appState, setAppState, initialAppState }}>
      <RouterProvider router={router} fallbackElement={<Fallback />} />
    </AppContext.Provider>
  );
}

export default App;
