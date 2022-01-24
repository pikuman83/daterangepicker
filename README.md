# Daterangepicker

https://drpicker.netlify.app
The project is created as a technical test for Unblur. Represents 3 functionalities.

>   A calendar with date range selection facility.
>   A card which receives the selected dates and allow to email it to a given address.
>   A card which shows a random fact occured on the first selected date.

<!-- https://github.com/pikuman83/daterangepicker//blob/main/src -->
![Home page screeshot](/assets/appComponent.PNG?raw=true)

## Structure
                       /App component
                      / |
                     /  |__ CalendarContainer
                    /   |__ Calendar
                   /   /|   |__CalendarBody
                  /   / |    
        Global Service  |
                \    \ \|__Reminder (A card with a form connected to an api )
                 \    \ |
                  \    \|__OnThisDay
                   \    |
                    \   |__Contact
                     \  |
                      \ |__Snackbar

## Components & Services
#### GlobalService:

    -   Initialize firebase backend app to post data to the FireStore, which is configured to trigger email, automatically on a new entry using firebase functions with nodemailer & sendGrid SMTP.
    -   Call a public api with httpClient and Observable which returns a stream of random facts from wikipedia.
    -   Handles the app state, setting observers to the variables and letting them to be subscribed from different components during the full lifecycle of the whole app using Rxjs Subjects.

#### CalendarContainer: 

*   A button like card to open the calendar 

#### CalendarComponent: 

![Calendar screeshot](/assets/calendar.PNG?raw=true)

*   Create the calendar, allow navigation through it, render the buttons, labels and inputs.

#### CalendarBodyComponent: 
*   Populates the dates using html's table selector and handle different selection strategies.

#### ReminderComponent: 

![Reminder component screeshot](/assets/reminder.PNG?raw=true)

*   A card like collpsable button, when collapsed, shows a form with its validations, takes email and notes as inputs and send it to the given email.

#### OnThisDayComponent:

![Special facts screeshot](/assets/onThisDay.PNG?raw=true)

*   A card like collapsable button, when collapsed, shows a random fact occured on the selected date (dateFrom).

#### ContactComponent: 

*   Always stick to the footer, renders the animated contact and social media links badges.

#### SnackbarComponent:

*   Invocable from the whole app, a cute small notification bar, automatically hides after 3 seconds.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Unit tests
Not requried - out of scope

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3.