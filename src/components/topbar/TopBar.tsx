import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import ThemeToggle from "../theme-toggle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    themeToggle: {
      marginLeft: "auto",
    },
  })
);

type TopBarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopBar = ({ darkMode, setDarkMode }: TopBarProps) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <div className={classes.themeToggle}>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
