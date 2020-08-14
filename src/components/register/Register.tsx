import { Button, LinearProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import axios, { AxiosError } from "axios";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { createRef, Suspense, useEffect, useState } from "react";
import * as Yup from "yup";
import { PasswordInput, UserForm } from "../form-utils";
import Loading from "../loading";
import HCaptchaComponent from "./HCaptcha";
import scryptHash from "./password-hash";

const HCaptcha = React.lazy(() => import("@hcaptcha/react-hcaptcha"));

interface RegisterFormValues {
  email: string;
  name: string;
  username: string;
  password: string;
  acceptedTerms: boolean;
  captcha: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
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
  const initialValues: RegisterFormValues = {
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
    <UserForm
      formTitle="Register to start using NeoCallisto"
      formikForm={
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
                showStrengthBar
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
                {siteKey && (
                  <Field
                    name="captcha"
                    component={HCaptcha}
                    ref={captchaRef}
                    sitekey={siteKey}
                    onVerify={(token: string) =>
                      formikBag.setFieldValue("captcha", token)
                    }
                  />
                )}
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
                Create Account
              </Button>
            </Form>
          )}
        />
      }
    />
  );
};

export default Register;
