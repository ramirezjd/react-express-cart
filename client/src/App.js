import React, { useState, createContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import NoMatch from "./pages/NoMatch";
import RootErrorBoundary, { Fallback } from "./pages/RootErrorBoundary";

const initialAppState = {
  loggedIn: false,
  authItem: {},
  status: "idle",
};

export const AppContext = createContext(initialAppState);
function App() {
  const [appState, setAppState] = useState(initialAppState);
  let router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <RootErrorBoundary />,
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
      path: "cart",
      element: <Cart />,
      errorElement: <RootErrorBoundary />,
    },
    {
      path: "*",
      element: <NoMatch />,
      errorElement: <RootErrorBoundary />,
    },
  ]);
  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <RouterProvider router={router} fallbackElement={<Fallback />} />
    </AppContext.Provider>
  );
}

export default App;
