import DateFnsUtils from "@date-io/date-fns";
import { Container, CssBaseline, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React, { Suspense, useState } from "react";

const ParticlesBg = React.lazy(() => import("particles-bg"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

const DateSelector = () => {
  const classes = useStyles();

  const [calendarOpen, setCalendarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (date !== null) {
      setSelectedDate(date);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <Container component="main">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography variant="h2">Please, select a date below:</Typography>
            <KeyboardDatePicker
              clearable
              orientation="landscape"
              variant="inline"
              open={calendarOpen}
              onClose={() => setCalendarOpen(!calendarOpen)}
              onOpen={() => setCalendarOpen(!calendarOpen)}
              openTo="date"
              format="MM/dd/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              minDate={new Date(1978, 4, 29)}
              maxDate={new Date()}
            />
          </div>
        </Container>
        <Suspense fallback={<div />}>
          <ParticlesBg type="color" bg />
        </Suspense>
      </div>
    </MuiPickersUtilsProvider>
  );
};

export default DateSelector;
