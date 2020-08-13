import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import ReactLoading, { LoadingProps } from "react-loading";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "10em",
      position: "relative",
    },
    loading: {
      display: "block",
      margin: 0,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  })
);

const Loading = ({ type, color }: LoadingProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ReactLoading
        type={type}
        color={color}
        height={"20%"}
        width={"20%"}
        className={classes.loading}
      />
    </div>
  );
};

export default Loading;
