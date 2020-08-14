import { Button, Grid, LinearProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { PasswordInput, UserForm } from "../form-utils";

interface LoginFormValues {
  emailOrUsername: string;
  password: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
  })
);

const Login = () => {
  const initialValues: LoginFormValues = {
    emailOrUsername: "",
    password: "",
  };

  const classes = useStyles();

  const [seed, setSeed] = useState(new Uint8Array());

  return (
    <UserForm
      formTitle="Welcome back to NeoCallisto!"
      formikForm={
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            emailOrUsername: Yup.string().required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={(values, actions) => {
            console.log("sent");
          }}
          render={(formikBag) => (
            <Form className={classes.form}>
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                name="emailOrUsername"
                type="text"
                label="Email or username"
                autoComplete="email"
              />
              <Field
                component={PasswordInput}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                autoComplete="password"
              />
              {formikBag.isSubmitting && <LinearProgress />}
              <Button
                variant="contained"
                color="primary"
                disabled={formikBag.isSubmitting}
                onClick={formikBag.submitForm}
                fullWidth
              >
                Log In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/password-recovery">Forgot your password?</Link>
                </Grid>
                <Grid item>
                  <Link to="/register">
                    Don&apos;t have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        />
      }
    />
  );
};

export default Login;
