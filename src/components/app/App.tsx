import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../landing-page";
import TopBar from "../topbar";
import "./App.css";

const App = () => {
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
      <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="register"
            element={
              <div>
                <h1>hi</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
