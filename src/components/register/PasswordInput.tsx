import InputAdornment from "@material-ui/core/InputAdornment";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { TextField, TextFieldProps } from "formik-material-ui";
import React, { Suspense, useState } from "react";

const PasswordStrengthBar = React.lazy(() =>
  import("react-password-strength-bar")
);

const useStyles = makeStyles(() =>
  createStyles({
    eye: {
      cursor: "pointer",
    },
  })
);

export const PasswordInput = (props: TextFieldProps) => {
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
