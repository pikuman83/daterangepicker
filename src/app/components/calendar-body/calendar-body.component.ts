import { Component, Input } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  // encapsulation: ViewEncapsulation.None
})
export class CalendarBodyComponent {
    
  cYear = new Date().getFullYear();
  cMonth = new Date().getMonth();
  dateFrom!: Date|null;
  dateTo!:Date|null;
  weekDays = ['M','T','W','T','F','S','S'];//
  @Input() calendar: Array<Array<number>> = [];

  constructor(public service: GlobalService) {
    service.dateFrom.subscribe(dF => this.dateFrom = dF);
    service.dateTo.subscribe(dT => this.dateTo = dT)
  }

  isToday(date: any): boolean{
    const today = new Date();
    if (today.getDate() === date && today.getFullYear() === this.cYear && today.getMonth() === this.cMonth) return true;
    return false
  }

  // add this to the following if disable previous dates is required
  // const date1 = new Date(this.cYear, this.cMonth, date);
  // if (date1 < new Date()) return true;
  isDisable(row: number, date: number): boolean{
    if (row === 0 && date > 7) return true;
    if ((row === 4 || row === 5) && date < 20) return true;
    return false
  }
  
  selectDates(date: number, row: number, e: any){    
    if (!this.isDisable(row, date)){
      const el = e.target as HTMLTableCellElement;
      if ((this.dateFrom && this.dateTo) || (!this.dateFrom && !this.dateTo)) this._clearFocus();
      if(!this.dateFrom){
        el.classList.add('selectedCell');

      }
      if (this.dateFrom){
        if(this._isNotOldDate(date)){
          el.classList.add('selectedCell');
        };
      }
      
      if (this.dateTo) {
        this.service.dateTo.next(null); 
        this.service.dateFrom.next(null);
        const el = document.querySelectorAll('.dates');
        Array.from(el).forEach(x => {
          x.classList.remove('focus-active')
        })
      }
      if (this.dateFrom){
        if (this._isNotOldDate(date)){
          this.service.dateTo.next(new Date(this.cYear, this.cMonth, date));
        }
      }
      else{
        this.service.dateFrom.next(new Date(this.cYear, this.cMonth, date));
        this.service.dateTo.next(null);
      }
    }
  }

  _isNotOldDate(date: number): boolean {
    const dateFrom = new Date(this.dateFrom!.getFullYear(), this.dateFrom!.getMonth() - 1, this.dateFrom!.getDate());
    const newDate = new Date(this.cYear, this.cMonth, date);
    if (newDate <= dateFrom) return false;
    return true
  }

  _clearFocus(){
    const el = document.querySelectorAll('.dates');
    Array.from(el).forEach(x => {
      x.classList.remove('selectedCell', 'focus-active')
    })
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
        if(!el[i].classList.contains('inactive'))
        el[i].classList.add('focus-active')
      }
    }
  }

}