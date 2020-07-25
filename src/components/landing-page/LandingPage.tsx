import { CssBaseline } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Sky from "react-sky";
import satellite1 from "../../assets/images/satellite1.png";
import satellite2 from "../../assets/images/satellite2.png";
import satellite3 from "../../assets/images/satellite3.png";
import satellite4 from "../../assets/images/satellite4.png";
import satellite5 from "../../assets/images/satellite5.png";
import sun1 from "../../assets/images/sun1.png";
import sun2 from "../../assets/images/sun2.png";
import sun3 from "../../assets/images/sun3.png";
import sun4 from "../../assets/images/sun4.png";
import sun5 from "../../assets/images/sun5.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        // margin: theme.spacing(1),
      },
      // theme: "dark"
    },
    paper: {
      // marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

type LandingPageProps = {
  darkMode: boolean;
};

const LandingPage = ({ darkMode }: LandingPageProps) => {
  const classes = useStyles();

  return (
    <Container className={classes.root} component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Sky
          images={{
            0: satellite1,
            1: satellite2,
            2: satellite3,
            3: satellite4,
            4: satellite5,
            5: sun1,
            6: sun2,
            7: sun3,
            8: sun4,
            9: sun5,
          }}
          how={130}
          time={40}
          size={"100px"}
          background={"#424242"}
        />
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            NeoCallisto
          </Typography>
        </Box>
      </div>
    </Container>
  );
};

export default LandingPage;
