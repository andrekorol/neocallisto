import {
  createMuiTheme,
  Theme,
  ThemeProvider,
  ThemeProviderProps,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "../loading";
import TopBar from "../topbar";

const LandingPage = lazy(() => import("../landing-page"));
const Register = lazy(() => import("../register"));

const App = (): React.ReactElement<ThemeProviderProps<Theme>> => {
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
        <Suspense
          fallback={
            <Loading
              type="spinningBubbles"
              color={theme.palette.primary.main}
            />
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
