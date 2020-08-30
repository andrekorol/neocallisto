import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  SocialLink,
  SocialProvider,
} from "@mui-treasury/components/socialLink";
import { useRoundSocialLinkStyles } from "@mui-treasury/styles/socialLink/round";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginProps from "../form-utils/LoggedUserProps";
import ThemeToggle from "../theme-toggle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarRight: {
      marginLeft: "auto",
    },
    appTitle: {
      position: "absolute",
      left: "42%",
    },
    logoutButton: {
      marginRight: theme.spacing(2),
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
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post("/api/users/logout").then(() => {
      setLoggedUser("none");
      navigate("/", { replace: true });
    });
  };

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
        <div className={classes.toolbarRight}>
          {loggedUser !== "none" && (
            <Button
              variant="contained"
              color="secondary"
              className={classes.logoutButton}
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
