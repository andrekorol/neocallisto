import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { createRef, Suspense, useEffect, useState } from "react";
import * as Yup from "yup";
import Loading from "../loading";
import getHash from "./hash";
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

  const [formError, setFormError] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const [siteKey, setSiteKey] = useState("");
  const [seed, setSeed] = useState(new Uint8Array());

  useEffect(() => {
    axios.get("/admin/sitekey").then((resp) => setSiteKey(resp.data));
    axios
      .get("/admin/seed")
      .then((res) => setSeed(Uint8Array.from(Object.values(res.data))));
  }, []);

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
              setSnackBarMessage("You must accept the terms and conditions");
              setFormError(true);
              setSubmitting(false);
              return;
            }

            if (!values.captcha) {
              setSnackBarMessage("You must prove that you are a human");
              setFormError(true);
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
                    captchaRef.current?.resetCaptcha();
                    setSubmitting(false);
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
                    setFormError(false);
                  }}
                />
              </Suspense>
              <Snackbar
                open={formError}
                autoHideDuration={6000}
                onClose={(_, reason) => {
                  if (reason === "clickaway") {
                    return;
                  }

                  setFormError(false);
                }}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
              >
                <Alert severity="error">
                  {snackBarMessage}
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    className={classes.closeButton}
                    onClick={() => setFormError(false)}
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
