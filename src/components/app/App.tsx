import Paper from "@material-ui/core/Paper";
import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../landing-page/LandingPage";
import TopBar from "../topbar";
import "./App.css";

const App = () => {
  const prefersDarkMode: boolean = useMediaQuery(
    "(prefers-color-scheme: dark)"
  );

  const [darkMode, setDarkMode] = useState(prefersDarkMode);

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
      <Paper style={{ height: "100vh" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage darkMode={darkMode} />} />
          </Routes>
        </BrowserRouter>
      </Paper>
    </ThemeProvider>
  );
};

export default App;
