import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { createRef, Suspense, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PasswordInput, UserForm } from "../form-utils";
import RegisterProps from "../form-utils/LoggedUserProps";
import scryptHash from "../form-utils/password-hash";
import SnackbarErrorAlert from "../form-utils/SnackbarErrorAlert";
import Loading from "../loading";
import HCaptchaComponent from "./HCaptcha";

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
  })
);

const Register = ({ loggedUser, setLoggedUser }: RegisterProps) => {
  const navigate = useNavigate();

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
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [siteKey, setSiteKey] = useState("");
  const [seed, setSeed] = useState(new Uint8Array());

  useEffect(() => {
    axios.get("/api/admin/sitekey").then((resp) => setSiteKey(resp.data));
    axios
      .get("/api/admin/seed")
      .then((res) => setSeed(new Uint8Array(Object.values(res.data))));
  }, []);

  const captchaRef = createRef<HCaptchaComponent>();

  if (loggedUser && loggedUser !== "none") return <Navigate to="/" replace />;

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
              setSnackbarMessage("You must accept the terms and conditions");
              setFormError(true);
              actions.setSubmitting(false);
              return;
            }

            if (!values.captcha) {
              setSnackbarMessage("You must prove that you are a human");
              setFormError(true);
              actions.setSubmitting(false);
              return;
            }

            scryptHash(values.password, seed).then((passwordHash) => {
              axios
                .post(
                  "/api/users/register",
                  Object.assign({}, values, {
                    password: passwordHash,
                    salt: seed,
                  })
                )
                .then((res: AxiosResponse) => {
                  captchaRef.current?.resetCaptcha();
                  actions.setSubmitting(false);
                  setLoggedUser(res.data);
                  navigate("/");
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

                  setSnackbarMessage(
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
              <SnackbarErrorAlert
                formError={formError}
                setFormError={setFormError}
                snackbarMessage={snackbarMessage}
              />
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
