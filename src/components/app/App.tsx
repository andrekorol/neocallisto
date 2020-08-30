import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import axios from "axios";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "../loading";
import Login from "../login";
import TopBar from "../topbar";

const LandingPage = lazy(() => import("../landing-page"));
const Register = lazy(() => import("../register"));

const App = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    axios
      .get("/api/users/current-user")
      .then((res) => setUser(res.data))
      .catch(() => setUser("none"));
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const prefersDarkMode: boolean = useMediaQuery(
    "(prefers-color-scheme: dark)"
  );
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme: Theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <TopBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        loggedUser={user}
        setLoggedUser={setUser}
      />
      <BrowserRouter>
        <Suspense
          fallback={
            <Loading
              type="spinningBubbles"
              color={theme.palette.primary.main}
            />
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  user !== "none" ? (
                    <div>hi {user}</div>
                  ) : (
                    <LandingPage />
                  )
                ) : (
                  <Loading type="spin" color={theme.palette.primary.main} />
                )
              }
            />
            <Route
              path="register"
              element={<Register loggedUser={user} setLoggedUser={setUser} />}
            />
            <Route
              path="login"
              element={<Login loggedUser={user} setLoggedUser={setUser} />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
