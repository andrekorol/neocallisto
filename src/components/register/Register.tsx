import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { createRef } from "react";
import * as Yup from "yup";
import { PasswordInput } from "./PasswordInput";

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
  })
);

const Register = () => {
  const classes = useStyles();

  const captchaRef = createRef<HCaptcha>();

  const siteKey = "c48a4bdf-cab5-4a46-b23f-35a39125f592";
  console.log(process.env);

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
            captcha: Yup.string().required("Must prove that you are a human"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ submitForm, isSubmitting, setFieldValue }) => (
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
                label="Password (8+ characters)"
                autoComplete="password"
              />
              <HCaptcha
                ref={captchaRef}
                sitekey={siteKey}
                onVerify={(token) => setFieldValue("captcha", token)}
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
