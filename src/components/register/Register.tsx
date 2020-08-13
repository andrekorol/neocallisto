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
import axios, { AxiosError } from "axios";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { createRef, Suspense, useEffect, useState } from "react";
import * as Yup from "yup";
import Loading from "../loading";
import HCaptchaComponent from "./HCaptcha";
import scryptHash from "./password-hash";
import { PasswordInput } from "./PasswordInput";

const HCaptcha = React.lazy(() => import("@hcaptcha/react-hcaptcha"));

interface MyFormValues {
  email: string;
  name: string;
  username: string;
  password: string;
  acceptedTerms: boolean;
  captcha: string;
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
  const initialValues: MyFormValues = {
    email: "",
    name: "",
    username: "",
    password: "",
    acceptedTerms: false,
    captcha: "",
  };

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
          initialValues={initialValues}
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
          onSubmit={(values, actions) => {
            if (!values.acceptedTerms) {
              setSnackBarMessage("You must accept the terms and conditions");
              setFormError(true);
              actions.setSubmitting(false);
              return;
            }

            if (!values.captcha) {
              setSnackBarMessage("You must prove that you are a human");
              setFormError(true);
              actions.setSubmitting(false);
              return;
            }

            scryptHash(values.password, seed).then((passwordHash) => {
              axios
                .post(
                  "/api/users",
                  Object.assign({}, values, {
                    password: passwordHash,
                    salt: seed,
                  })
                )
                .then(() => {
                  captchaRef.current?.resetCaptcha();
                  actions.setSubmitting(false);
                  alert("Account created sucessfully");
                })
                .catch((err: AxiosError) => {
                  actions.setSubmitting(false);
                  const { error, message } = err.response?.data;

                  if (error.keyValue.email) {
                    actions.setFieldError(
                      "email",
                      "There's already an account registered with that email"
                    );
                  } else if (error.keyValue.username) {
                    actions.setFieldError(
                      "username",
                      "Username already in use"
                    );
                  }

                  setSnackBarMessage(
                    `${message} Please check the form fields and then try again.`
                  );
                  setFormError(true);
                });
            });
          }}
          render={(formikBag) => (
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
                  error: !formikBag.values.acceptedTerms,
                }}
              />
              <Suspense fallback={<Loading />}>
                <Field
                  name="captcha"
                  component={HCaptcha}
                  ref={captchaRef}
                  sitekey={siteKey}
                  onVerify={(token: string) =>
                    formikBag.setFieldValue("captcha", token)
                  }
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
              {formikBag.isSubmitting && <LinearProgress />}
              <Button
                variant="contained"
                color="primary"
                disabled={formikBag.isSubmitting}
                onClick={formikBag.submitForm}
                fullWidth
              >
                Submit
              </Button>
            </Form>
          )}
        />
      </div>
    </Container>
  );
};

export default Register;
