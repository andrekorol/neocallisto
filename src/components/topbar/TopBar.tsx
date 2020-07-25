import AppBar from "@material-ui/core/AppBar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";

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
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          }
          label="Dark Mode"
          className={classes.themeToggle}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
