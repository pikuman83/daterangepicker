# Daterangepicker
The project is created as a technical test for Unblur. Represents 3 functionalities
*   A calendar with date range selection facility.
*   A card which receives the selected dates and allow to send it to an email.
*   A card which shows a random fact occured on the first selected date.

## Structure
* App component
    |
    |__ CalendarContainer (A button like card to open the calendar)
    |__ Calendar (create the calendar and allow navigation through it)
    |   |__CalendarBody (Populates the calendar body and allow the selections)
    |    
    |
    |__Reminder (A card with a form connected to an api )
    |
    |__onThisDay
    |
    |__Contact
    |
    |__Snackbar

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Unit tests
Not requried - out of scope

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3.