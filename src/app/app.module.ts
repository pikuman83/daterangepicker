import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar-container/calendar/calendar.component';
import { CalendarBodyComponent } from './components/calendar-container/calendar-body/calendar-body.component';
import { ContactComponent } from './components/contact/contact.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { CalendarContainerComponent } from './components/calendar-container/calendar-container.component';
import { OnthisdayComponent } from './components/onthisday/onthisday.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CalendarBodyComponent,
    ContactComponent,
    SnackbarComponent,
    ReminderComponent,
    CalendarContainerComponent,
    OnthisdayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
