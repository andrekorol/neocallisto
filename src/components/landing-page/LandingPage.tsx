import { CssBaseline } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import satellite1 from "../../assets/images/satellite1.png";
import satellite2 from "../../assets/images/satellite2.png";
import sun1 from "../../assets/images/sun1.png";
import sun2 from "../../assets/images/sun2.png";

const Sky = React.lazy(() => import("react-sky"));
const ParticlesBg = React.lazy(() => import("particles-bg"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

const LandingPage = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  return (
    <div>
      <Container component="main">
        <CssBaseline />
        <div className={classes.paper}>
          <Suspense fallback={<div />}>
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
          </Suspense>
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
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("register")}
            >
              Sign Up to start using the app
            </Button>
            <Typography variant="h5">OR</Typography>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => navigate("login")}
            >
              Log In if you already have an account
            </Button>
          </Box>
        </div>
      </Container>
      <Suspense fallback={<div />}>
        <ParticlesBg type="cobweb" bg />
      </Suspense>
    </div>
  );
};

export default LandingPage;
