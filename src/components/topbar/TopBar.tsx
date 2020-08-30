import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
  SocialLink,
  SocialProvider,
} from "@mui-treasury/components/socialLink";
import { useRoundSocialLinkStyles } from "@mui-treasury/styles/socialLink/round";
import React from "react";
import LoginProps from "../form-utils/LoggedUserProps";
import ThemeToggle from "../theme-toggle";

const useStyles = makeStyles(() =>
  createStyles({
    themeToggle: {
      marginLeft: "auto",
    },
    appTitle: {
      position: "absolute",
      left: "42%",
    },
  })
);

type TopBarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopBar = ({
  darkMode,
  setDarkMode,
  loggedUser,
  setLoggedUser,
}: TopBarProps & LoginProps) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <SocialProvider useStyles={useRoundSocialLinkStyles}>
          <SocialLink
            brand={"GithubCircle"}
            href={"https://github.com/andrekorol/neocallisto"}
          />
        </SocialProvider>
        <SocialProvider useStyles={useRoundSocialLinkStyles}>
          <SocialLink
            brand={"Twitter"}
            href={"https://twitter.com/andrekorol1"}
          />
        </SocialProvider>
        {loggedUser !== "none" && (
          <Typography variant="h3" color="inherit" className={classes.appTitle}>
            NeoCallisto
          </Typography>
        )}
        <div className={classes.themeToggle}>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
