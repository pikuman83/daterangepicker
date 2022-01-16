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
  dateFrom!: Date|null;
  dateTo!: Date|null;
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
    // Remember Selection
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

  clearFocus(){
    const el = document.querySelectorAll('.dates');
    Array.from(el).forEach(x => {
      x.classList.remove('selectedCell')
    })
  }
  // on dateto removal, clear selection before hover (if possible)
  selectDates(date: number, row: number, e: any){
    const el = e.target as HTMLTableCellElement;
    if ((this.dateFrom && this.dateTo) || (!this.dateFrom && !this.dateTo)) this.clearFocus();
    el.classList.add('selectedCell')
    
    if (!this.isDisable(row, date)){
      if (this.dateTo) {
        this.dateTo = null; 
        this.dateFrom = null;
      }
      if (this.dateFrom){
        if (this._isNotOldDate(date)){
          this.dateTo = new Date(this.cYear, this.cMonth, date);
        }
      }
      else{
        this.dateFrom = new Date(this.cYear, this.cMonth, date);
        this.dateTo = null;
      }
    }
  }

  _isNotOldDate(date: number): boolean {
    const dateFrom = new Date(this.dateFrom!.getFullYear(), this.dateFrom!.getMonth() - 1, this.dateFrom!.getDate());
    const newDate = new Date(this.cYear, this.cMonth, date);
    if (newDate <= dateFrom) return false;
    return true
  }

  isRange(row: number, date: number): void{
    if (!this.isDisable(row, date)){
      if (this.dateFrom && this._isNotOldDate(date) && !this.dateTo){
        const el = document.querySelectorAll('.dates');
        for (let i = 0; i < el.length; i++){
          const index = Number(el[i].innerHTML);
          if (index === date && date >= date){
            this._hightlight(date);
            break;
          }
        }
      }
    }
  }

  _hightlight(end: number){
    const el = document.querySelectorAll('.dates');
    for (let i = 0; i < el.length; i++){
      el[i].classList.remove('focus-active');
      const index = Number(el[i].innerHTML);
      if (new Date(this.cYear, this.cMonth, index) >= this.dateFrom! && index <= end){
        if(!el[i].classList.contains('gray'))
        el[i].classList.add('focus-active')
      }
    }
  }

}

// apply emit the event to parent, which populates the data and ask to send it through email.
// 3rd click on selection or second to previous dates? test behaviours