import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Snackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { createRef, Suspense, useEffect, useState } from "react";
import * as Yup from "yup";
import { getHash } from "../../server/password";
import Loading from "../loading";
import HCaptchaComponent from "./HCaptcha";
import { PasswordInput } from "./PasswordInput";

const HCaptcha = React.lazy(() => import("@hcaptcha/react-hcaptcha"));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
    closeButton: {
      padding: theme.spacing(0.5),
    },
  })
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Register = () => {
  const classes = useStyles();

  const [captchaError, setCaptchaError] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const [siteKey, setSiteKey] = useState("");
  const [seed, setSeed] = useState(new Uint8Array());

  useEffect(() => {
    axios.get("/admin/sitekey").then((resp) => setSiteKey(resp.data));
    axios
      .get("/admin/seed")
      .then((res) => setSeed(Uint8Array.from(Object.values(res.data))));
  }, []);

  const handleClose = (
    _: React.SyntheticEvent<any>,
    reason: SnackbarCloseReason,
    setError: (value: React.SetStateAction<boolean>) => void
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setError(false);
  };

  const captchaRef = createRef<HCaptchaComponent>();

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
            acceptedTerms: false,
            captcha: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            name: Yup.string()
              .max(128, "Must be 128 characters or less")
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
            if (!values.acceptedTerms) {
              setTermsError(true);
              setSubmitting(false);
              return;
            }

            if (!values.captcha) {
              setCaptchaError(true);
              setSubmitting(false);
              return;
            }

            getHash(values.password, seed)
              .then((passwordHash) => {
                axios
                  .post(
                    "/api/users",
                    Object.assign(values, {
                      password: passwordHash,
                      salt: seed,
                    })
                  )
                  .then(() => {
                    alert("Account created sucessfully");
                  });
              })
              .catch(() => {
                captchaRef.current?.resetCaptcha();
                setSubmitting(false);
                alert("Could not create account, please try again");
              });
          }}
        >
          {({ submitForm, isSubmitting, setFieldValue, values }) => (
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
                label="Password (8+ characters)"
                autoComplete="password"
              />
              <Field
                component={CheckboxWithLabel}
                name="acceptedTerms"
                Label={{
                  label:
                    "I have read and accept the Terms and Conditions/Privacy Policy",
                  error: !values.acceptedTerms,
                }}
              />
              <Suspense fallback={<Loading />}>
                <Field
                  name="captcha"
                  component={HCaptcha}
                  ref={captchaRef}
                  sitekey={siteKey}
                  onVerify={(token: string) => {
                    setFieldValue("captcha", token);
                    setCaptchaError(false);
                  }}
                />
              </Suspense>
              <Snackbar
                open={termsError}
                autoHideDuration={6000}
                onClose={(
                  event: React.SyntheticEvent<any>,
                  reason: SnackbarCloseReason
                ) => handleClose(event, reason, setTermsError)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
              >
                <Alert severity="warning">
                  You must accept the terms and conditions
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    className={classes.closeButton}
                    onClick={() => setTermsError(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Alert>
              </Snackbar>
              <Snackbar
                open={captchaError}
                autoHideDuration={6000}
                onClose={(
                  event: React.SyntheticEvent<any>,
                  reason: SnackbarCloseReason
                ) => handleClose(event, reason, setCaptchaError)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
              >
                <Alert severity="error">
                  You must prove that you are a human
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    className={classes.closeButton}
                    onClick={() => setCaptchaError(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Alert>
              </Snackbar>
              {isSubmitting && <LinearProgress />}
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                fullWidth
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
