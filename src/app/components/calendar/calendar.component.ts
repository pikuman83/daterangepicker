import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class CalendarComponent implements OnInit {
  
  today = new Date();
  cYear = new Date().getFullYear();
  cMonth = new Date();
  weekDays = ['M','T','W','T','F','S','S'];
  dateFrom = '';
  dateTo = ''
  calendar: Array<Array<number>> = [];

  currentMonth(month: number){
    return this.datePipe.transform(month,'MMMM')
  }
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.createCalendar(this.cYear, this.cMonth.getMonth());
    const x = new Date().getDay();
    console.log(x)
  }

  createCalendar(year: number, month: number){
    this.calendar = [];
    this.cMonth = new Date(year, month);
    this.cYear = year;
    const weekDay = new Date(year, month).getDay(); //  - 6 (Monday - Sunday)
    const numbreOfdays= this.daysInMonth(year, month); //return current and previous months total number of days
    const startingPoint = this.getStartingPoint(weekDay, numbreOfdays.lastMonth); 
    let date = 1;
    for (let x = 0; x < 6; x++) {
      let row = [];
      for (let y = 0; y < 7; y++){
        if (date > numbreOfdays.currentMonth) date = 1;
        if (x === 0 && y === 0){
       row.push(startingPoint.start)
        }
        else if (x === 0 && y > 0 && y < startingPoint.wd + 1){
          row.push(startingPoint.start + y)
        }
        else {
          row.push(date);
          date++
        }
      }
      this.calendar.push(row)
    }
  }

  // check how many days in a month code from https://dzone.com/articles/determining-number-days-month
  daysInMonth(year: number, month: number) {
    const currentMonth = 32 - new Date(year, month, 32).getDate();
    if (month === 0) {
      month = 11
      year -= 1;
    }
    else month -= 1;
    const lastMonth = 32 - new Date(year, month, 32).getDate();
      return {currentMonth, lastMonth}
  }

  getStartingPoint(weekday: number, previousMonth: number){
    let start = 0;
    let wd = 0;
    switch(weekday){
      case(0): start = previousMonth - 5; wd = 5; break;
      case(1): start = previousMonth - 6; wd = 6; break;
      case(2): start = previousMonth - 0; wd = 0; break;
      case(3): start = previousMonth - 1; wd = 1; break;
      case(4): start = previousMonth - 2; wd = 2; break;
      case(5): start = previousMonth - 3; wd = 3; break;
      case(6): start = previousMonth - 4; wd = 4; break
    }
    return {start, wd};
  }

  next() {
    this.cYear = this.cMonth.getMonth() === 11 ? this.cYear + 1 : this.cYear;
    this.cMonth = new Date(this.cYear, (this.cMonth.getMonth() + 1) % 12);
    this.createCalendar(this.cYear, this.cMonth.getMonth());
  }

  previous() {
    this.cYear = this.cMonth.getMonth() === 0 ? this.cYear - 1 : this.cYear;
    this.cMonth = this.cMonth.getMonth() === 0 ? new Date(this.cYear, 11) : new Date(this.cYear, this.cMonth.getMonth() - 1);
    this.createCalendar(this.cYear, this.cMonth.getMonth());
  }

}
  // the result of getmonthdays keep highlighted (with exception of currentmonth) taking the base as (1)
  // highlight todays date and disable previous
  // get index of the selected day to run the formula of building the date
  // once their is 1st selected date, disable all previous and add the selection border to the next ones
  // once the second date is selected, change bg and disable the rest and wait for apply or clear?
  // or do not disable, next click selects the first date again from 1st day available
  // clear clears the selected date variables
  // apply emit the event to parent, which populates the data and ask to send it through email.