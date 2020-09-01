import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    button: {
      margin: theme.spacing(2),
      backgroundColor: teal[500],
      "&:hover": {
        backgroundColor: teal[700],
      },
    },
    searchProgress: {
      color: teal[600],
    },
  })
);

const DateSelector = () => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (date !== null) {
      setSelectedDate(date);
    }
  };

  const handleDataSearch = () => {
    if (!searching) {
      setSearching(true);
      setSearchError(false);
      const formattedDate = format(selectedDate, "yyyy/MM/dd");
      axios
        .post("/api/callisto/check-date", { formattedDate })
        .then(() => {
          setSearching(false);
        })
        .catch((err) => {
          setSearching(false);
          const errorStatusCode = err.response.status;
          setErrorMessage(
            `${
              errorStatusCode === 404
                ? "No data found for the selected date. Please try selecting another one."
                : "Internal error, please try searching again."
            }`
          );
          setSearchError(true);
        });
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container component="main">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography variant="h4">
            Select a date below to search for data on the e-Callisto network:
          </Typography>
          <KeyboardDatePicker
            clearable
            orientation="landscape"
            variant="inline"
            open={false}
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            minDate={new Date(1978, 4, 29)}
            maxDate={new Date()}
            margin="dense"
          />
          <DatePicker
            orientation="landscape"
            variant="static"
            openTo="date"
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            minDate={new Date(1978, 4, 29)}
            maxDate={new Date()}
            margin="dense"
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            disabled={searching}
            startIcon={<SearchIcon />}
            onClick={handleDataSearch}
          >
            Search
          </Button>
          {searching && <CircularProgress className={classes.searchProgress} />}
          {searchError && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}
        </div>
      </Container>
    </MuiPickersUtilsProvider>
  );
};

export default DateSelector;
