import { Avatar, Container, CssBaseline, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import React from "react";

type UserFormProps = {
  formTitle: string;
  formikForm: JSX.Element;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
  })
);

export const UserForm = ({ formTitle, formikForm }: UserFormProps) => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <WbSunnyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {formTitle}
        </Typography>
        {formikForm}
      </div>
    </Container>
  );
};
