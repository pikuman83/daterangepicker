import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class CalendarComponent implements OnInit {
  
  @Output() newItemEvent = new EventEmitter<any>();
  
  cYear = new Date().getFullYear();
  cMonth = new Date().getMonth();
  displayMonth!: Date;
  dateFrom = '';
  dateTo = '';
  weekDays = ['M','T','W','T','F','S','S'];
  calendar: Array<Array<number>> = [];
  disable = false;
  
  constructor() { }
  abcd(){
    this.newItemEvent.emit({dF: this.dateFrom, dT: this.dateTo})
  }

  ngOnInit(): void {
    this.createCalendar(this.cYear, this.cMonth);
  }

  createCalendar(year: number, month: number){
    this.calendar = [];
    this.cYear = year;
    this.cMonth = month;
    this.displayMonth = new Date(year, month); //because date pipe doesn't detect changes on this.cMonth update
    const weekDay = new Date(year, month).getDay(); //  - 6 (Monday - Sunday)
    const numbreOfdays= this.daysInMonth(year, month); //return current and previous months total number of days
    const startingPoint = this.getStartingPoint(weekDay, numbreOfdays.lastMonth); 
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
    this.cYear = this.cMonth === 11 ? this.cYear + 1 : this.cYear;
    this.cMonth = (this.cMonth + 1) % 12;
    this.createCalendar(this.cYear, this.cMonth);
  }

  previous() {
    this.cYear = this.cMonth === 0 ? this.cYear - 1 : this.cYear;
    this.cMonth = this.cMonth === 0 ? 11 : this.cMonth - 1;
    this.createCalendar(this.cYear, this.cMonth);
  }

  // add this to the following if disable previous dates is required
  // const date1 = new Date(this.cYear, this.cMonth, date);
  // if (date1 < new Date()) return true;
  isDisable(row: number, date: number): boolean{
    if (row === 0 && date > 7) return true;
    if ((row === 4 || row === 5) && date < 20) return true;
    return false
  }

  today(date: any): boolean{
    const today = new Date();
    if (today.getDate() === date && today.getFullYear() === this.cYear && today.getMonth() === this.cMonth) return true;
    return false
  }

  selectDates(date: number){
    if (this._isNotDisabled(date)){
      if (this.dateTo) {
        this.dateTo = ''; 
        this.dateFrom = '';
      }
      if (this.dateFrom){
        if (this._isNotOldDate(this.dateFrom, date)){
          this.dateTo = `${date < 10 ? 0 : ''}${date}/${this.cMonth < 9? 0: ''}${this.cMonth + 1}/${this.cYear}`;
        }
      }
      else{
        // focus element
        this.dateFrom = `${date < 10 ? 0 : ''}${date}/${this.cMonth < 9? 0: ''}${this.cMonth + 1}/${this.cYear}`;
        this.dateTo = '';
      }
    }
  }

  _isNotDisabled(date: number){
    const el = document.getElementsByClassName('gray');
    let x = [];
    for (let i = 0; i < 6; i++){
      if (el[i].innerHTML !== date.toString()){
        x.push(Number(el[i].innerHTML))
      }
    }  

    if (!x.includes(date)){
      return true
    }
    return false
  }

  _isNotOldDate(df: string, date: number): boolean {
    const day = Number(df.substring(0,2));
    const month = Number(df.substring(3,5));
    const year = Number(df.substring(6,10));
    const date1 = new Date(year, month - 1, day);
    const date2 = new Date(this.cYear, this.cMonth, date);
    if (date2 <= date1) return false;
    return true
  }

}

// add the selection border to dates once datefrom
// once the second date is selected, change bg and wait for apply or clear?
// clear clears the selected date variables
// apply emit the event to parent, which populates the data and ask to send it through email.