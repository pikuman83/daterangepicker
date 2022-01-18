import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Output() datesEvent = new EventEmitter<any>(); // Emit the selected dates to the app component
  hide = true; //bound to child component through service, closes the calendar
  cYear = new Date().getFullYear(); //keep track of the current year
  cMonth = new Date().getMonth(); //keep track of the current month
  displayMonth!: Date; // value is given on calendar generation
  dateFrom!: Date|null; // bound to other components through service
  dateTo!: Date|null; // bound to other components through service
  calendar: Array<Array<number>> = []; //calendar body array (contains all the dates)

  // injects the service holding "Rxjs subjects" to handle app state
  constructor(public service: GlobalService) {
    service.popUp.subscribe(hide => this.hide = hide);
    service.dateFrom.subscribe(dF => this.dateFrom = dF)
    service.dateTo.subscribe(dT => this.dateTo = dT)
  }

  ngOnInit(): void {
    // initially creates calendar with current date
    this.createCalendar(this.cYear, this.cMonth); 
    // something strange is happening, the following formula returns next month total.
    console.log(32 - new Date(2022, 1, 32).getDate())
  }

  /**
   * Main function, generate the calendar.
   * @param year, number type value, initialized with current year, 
   * later on provided by next() and previous() function.
   * @param month, number type value, initialized with current year, 
   * later on provided by next() and previous() function.
   */
  createCalendar(year: number, month: number){

    this.calendar = [];
    this.cYear = year;
    this.cMonth = month;

    //because 'datepipe' doesn't detect changes on this.cMonth update
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
   * check how many days in a month, adding 
   * code partially taken from * https://dzone.com/articles/determining-number-days-month
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
    this.cYear = this.cMonth === 11 ? this.cYear + 1 : this.cYear;
    this.cMonth = (this.cMonth + 1) % 12;
    this.createCalendar(this.cYear, this.cMonth);
    if(this.dateFrom){
      // Remember Selection state
      // if dateto and dateto monthyear lower than this, select all from datefrom (if df belongs to this)
      // else if dateto = current month, select untill dateto
    }
  }

  previous() {
    this.cYear = this.cMonth === 0 ? this.cYear - 1 : this.cYear;
    this.cMonth = this.cMonth === 0 ? 11 : this.cMonth - 1;
    this.createCalendar(this.cYear, this.cMonth);
    if(this.dateFrom){
      // Remember Selection state
      // if dateto and dateto monthyear higher than this, select all from datefrom (if df belongs to this)
      // else dateto = current month, select untill dateto
    }
  }

  clear(){
    this.service.dateFrom.next(null);
    this.service.dateTo.next(null);
    const el = document.querySelectorAll('.dates');
    Array.from(el).forEach(e => e.classList.remove('focus-active', 'selectedCell'));
  }


  sendToParent(){
    if (this.dateFrom && this.dateTo){
      this.datesEvent.emit({dF:this.dateFrom, dT:this.dateTo});
      this.service.popUp.next(true)
    }
    else{
      // generate a notification component
      // A div on the app component (with time to turn the variable false again) convocable through service from the whole app
    }
  }

}