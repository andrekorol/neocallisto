import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      padding: theme.spacing(0.5),
    },
  })
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

type SnackbarErrorAlertProps = {
  formError: boolean;
  setFormError: React.Dispatch<React.SetStateAction<boolean>>;
  snackbarMessage: string;
};

const SnackbarErrorAlert = (props: SnackbarErrorAlertProps) => {
  const classes = useStyles();

  return (
    <Snackbar
      open={props.formError}
      autoHideDuration={6000}
      onClose={(_, reason) => {
        if (reason === "clickaway") {
          return;
        }

        props.setFormError(false);
      }}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <Alert severity="error">
        {props.snackbarMessage}
        <IconButton
          aria-label="close"
          color="inherit"
          className={classes.closeButton}
          onClick={() => props.setFormError(false)}
        >
          <CloseIcon />
        </IconButton>
      </Alert>
    </Snackbar>
  );
};

export default SnackbarErrorAlert;
