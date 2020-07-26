import { CssBaseline } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParticlesBg from "particles-bg";
import React from "react";
import Sky from "react-sky";
import satellite1 from "../../assets/images/satellite1.png";
import satellite2 from "../../assets/images/satellite2.png";
import sun1 from "../../assets/images/sun1.png";
import sun2 from "../../assets/images/sun2.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      // marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

const LandingPage = () => {
  const classes = useStyles();

  return (
    <div>
      <Container component="main">
        <CssBaseline />
        <div className={classes.paper}>
          <Sky
            images={{
              0: satellite1,
              1: satellite2,
              2: sun1,
              3: sun2,
            }}
            how={40}
            time={40}
            size={"100px"}
          />
          <Box my={4} className={classes.paper}>
            <Typography variant="h1" component="h1" gutterBottom>
              NeoCallisto
            </Typography>
            <Typography variant="h5">
              A modern way to interact with data from the e-Callisto
              International Network of Solar Radio Spectrometers
            </Typography>
          </Box>
          <Box my={4} className={classes.paper}>
            <Button variant="contained" color="primary" size="large">
              Sign Up to start using the app
            </Button>
            <Typography variant="h5">OR</Typography>
            <Button variant="contained" color="secondary" size="small">
              Log In if you already have an account
            </Button>
          </Box>
        </div>
      </Container>
      <ParticlesBg type="cobweb" bg />
    </div>
  );
};

export default LandingPage;
