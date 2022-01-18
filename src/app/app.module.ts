import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CalendarBodyComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
