import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  InputAdornment,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Field, Form, Formik } from "formik";
import { TextField, TextFieldProps } from "formik-material-ui";
import React, { Suspense, useState } from "react";
import * as Yup from "yup";

const PasswordStrengthBar = React.lazy(() =>
  import("react-password-strength-bar")
);

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
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    eye: {
      cursor: "pointer",
    },
  })
);

const PasswordInput = (props: TextFieldProps) => {
  const classes = useStyles();

  const [passwordIsMasked, setPasswordIsMasked] = useState(true);

  const togglePasswordMask = () => {
    setPasswordIsMasked(!passwordIsMasked);
  };

  const password = props.form.values.password;

  return (
    <>
      <TextField
        type={passwordIsMasked ? "password" : "text"}
        {...props}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {passwordIsMasked ? (
                <VisibilityIcon
                  className={classes.eye}
                  onClick={togglePasswordMask}
                />
              ) : (
                <VisibilityOffIcon
                  className={classes.eye}
                  onClick={togglePasswordMask}
                />
              )}
            </InputAdornment>
          ),
        }}
      />
      <Suspense fallback={<div />}>
        {password !== "" ? (
          <PasswordStrengthBar password={password} />
        ) : (
          <div />
        )}
      </Suspense>
    </>
  );
};

const Register = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create account
        </Typography>
        <Formik
          initialValues={{
            email: "",
            name: "",
            username: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            name: Yup.string()
              .max(32, "Must be 32 characters or less")
              .required("Required"),
            username: Yup.string()
              .max(32, "Must be 32 characters or less")
              .required("Required"),
            password: Yup.string()
              .min(8, "Must be at least 8 characters")
              .max(100, "Must be 100 characters or less")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form className={classes.form}>
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                autoFocus
              />
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                name="name"
                type="text"
                label="Full Name"
                autoComplete="name"
              />
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                name="username"
                type="text"
                label="Username"
                autoComplete="username"
              />
              <Field
                component={PasswordInput}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password (6+ characters)"
                autoComplete="password"
              />
              {isSubmitting && <LinearProgress />}
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default Register;
