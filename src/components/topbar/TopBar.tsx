import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import {
  SocialLink,
  SocialProvider,
} from "@mui-treasury/components/socialLink";
import { useRoundSocialLinkStyles } from "@mui-treasury/styles/socialLink/round";
import React from "react";
import ThemeToggle from "../theme-toggle";

const useStyles = makeStyles(() =>
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
        <div className={classes.themeToggle}>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
