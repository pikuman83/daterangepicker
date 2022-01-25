import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  cYear = new Date().getFullYear(); //keep track of the current year
  cMonth = new Date().getMonth(); //keep track of the current month
  displayMonth!: Date; // value is given on calendar generation
  dateFrom!: Date|null; // available in the whole app, tracks the first selected date
  dateTo!: Date|null; // available in the whole app, tracks the second selected date
  calendar: Array<Array<number>> = []; //calendar body array (7 x 6)
  selectedDates = false; // used to control the state during navigation

  // injects the service's "Rxjs subjects" to handle the app state
  constructor(public service: GlobalService) {
    service.dateFrom.subscribe(dF => this.dateFrom = dF)
    service.dateTo.subscribe(dT => this.dateTo = dT)
  }

  ngOnInit(): void {
    this.createCalendar(this.cYear, this.cMonth); 
  }

  /**
   * Generate the calendar.
   * @param year: initialized with current year, 
   * later on provided by next() and previous() function.
   * @param month: initialized with current month, 
   * later on provided by next() and previous() function.
   */
  createCalendar(year: number, month: number){

    this.calendar = [];
    this.cYear = year;
    this.cMonth = month;
    this.displayMonth = new Date(year, month);
    
    // 0 - 6 (Monday - Sunday)
    const weekDay = new Date(year, month).getDay();

    //return current and previous months total number of days
    const numbreOfdays= this._daysInMonth(year, month);

    // Based on total days in last month and 1st weekday (Monday to sunday) of the current month,
    // determines the entry point of the calendar 
    const startingPoint = this._getStartingPoint(weekDay, numbreOfdays.lastMonth); 

    // Fills the calendar variable in 6 rows of 7 dates each, through nested loop
    this._buildCalendar(startingPoint, numbreOfdays);
  }

  /**
   * check how many days in a month, Logic => Creating date with 32 as day, returns the first dates of 
   * the next month, i.e; (1) of februrary if we enquire for january, then (32 - 1) returns 
   * 31 (january) and all the months work in this way successivly.
   * code taken (partially) from * https://dzone.com/articles/determining-number-days-month
   * @param year : number
   * @param month : number
   * @returns an object with {total number of days in current month, and total number of days in last month}
   */
  _daysInMonth(year: number, month: number) {
    const currentMonth = 32 - new Date(year, month, 32).getDate();
    if (month === 0) {
      month = 11
      year -= 1;
    }
    else month -= 1;
    const lastMonth = 32 - new Date(year, month, 32).getDate();
      return {currentMonth, lastMonth}
  }

  /**
   * Determines the starting point of the calendar which depends on the weeday of the month to render and
   * total number of days in the last month.
   * @param weekday: the index of the 1st weekday of the month to render
   * @param previousMonth: total number of days in the last month 
   * @returns the first date to render in the calendar (from the last month, i.e; 26) and 
   */
  _getStartingPoint(weekday: number, previousMonth: number){
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

  /**
   * 
   * @param startingPoint: {st} 
   * @param numbreOfdays: total number of days in the month to render
   */

  _buildCalendar(startingPoint: any, numbreOfdays: any){
    let date = 1;
    for (let x = 0; x < 6; x++) {
      let row = [];
      for (let y = 0; y < 7; y++){
        if (date > numbreOfdays.currentMonth) {
          date = 1; //restart date after current month
        }
        if (x === 0 && y === 0){
          row.push(startingPoint.start);
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

  next() {
    this.selectedDates = false;
    this.cYear = this.cMonth === 11 ? this.cYear + 1 : this.cYear;
    this.cMonth = (this.cMonth + 1) % 12; //remainder: limits the number under 12
    this.createCalendar(this.cYear, this.cMonth);
    // if dates were already selected, the child component will check if they belongs to this month
    // to reactivate the relavant classes
    if(this.dateFrom && this.dateTo){
      this.selectedDates = true;
    }
  }

  previous() {
    this.selectedDates = false;
    this.cYear = this.cMonth === 0 ? this.cYear - 1 : this.cYear;
    this.cMonth = this.cMonth === 0 ? 11 : this.cMonth - 1;
    this.createCalendar(this.cYear, this.cMonth);
    // if dates were already selected, the child component will check if they belongs to this month
    // to reactivate the relavant classes
    if(this.dateFrom && this.dateTo){
        this.selectedDates = true;
    }
  }

  clear(){
    this.service.dateFrom.next(null);
    this.service.dateTo.next(null);
    document.querySelectorAll('td').forEach(e => {
      e.classList.remove('focus-active');
      e.firstElementChild?.classList.remove('selectedCell')
    });
  }

}