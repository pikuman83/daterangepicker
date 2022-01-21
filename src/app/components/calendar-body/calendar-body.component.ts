import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.css']
})
export class CalendarBodyComponent implements AfterViewChecked{
    
  @Input() cYear!: number;
  @Input() cMonth!: number; 
  dateFrom!: Date|null;
  dateTo!:Date|null;
  weekDays = ['M','T','W','T','F','S','S'];
  @Input() calendar: Array<Array<number>> = [];
  @Input() selectedDates!: boolean;

  constructor(public service: GlobalService) {
    service.dateFrom.subscribe(dF => this.dateFrom = dF);
    service.dateTo.subscribe(dT => this.dateTo = dT)
  }

  /**
   * Applied to control the state of the selected dates through var selectedDates coming from parent
   */
  ngAfterViewChecked(): void{
    // if(this.dateFrom && this.dateTo && this.selectedDates){
    //   const el = document.querySelectorAll('.dates');
    //   Array.from(el).forEach(x => {
    //     const date1 = new Date(this.cYear, this.cMonth, Number(x.innerHTML));
    //     if (!x.classList.contains('inactive') && 
    //         ((date1.getFullYear() === this.dateFrom?.getFullYear() && 
    //         date1.getMonth() === this.dateFrom.getMonth() && 
    //         date1.getDate() === this.dateFrom.getDate()) ||
    //         (date1.getFullYear() === this.dateTo?.getFullYear() && 
    //         date1.getMonth() === this.dateTo.getMonth() && 
    //         date1.getDate() === this.dateTo.getDate()))){
    //         x.classList.add('selectedCell')
    //       }
    //     if(!x.classList.contains('inactive') && date1 >= this.dateFrom! && date1 <= this.dateTo!){
    //         x.classList.add('focus-active')
    //     }
    //   })
    // }
  }

  isToday(row: number, date: number): boolean{
    if (!this.isDisable(row, date)){
      const today = new Date();
      if (today.getDate() === date && today.getFullYear() === this.cYear && today.getMonth() === this.cMonth) return true;
    }
    return false
  }
  
  
  isDisable(row: number|null, date: number): boolean{
    if (row === 0 && date > 7) return true; //porque en esta linea las fechas mayores solo pueden ser del mes pasado
    if ((row === 4 || row === 5) && date < 20) return true; //al contrario que la primera linea
    const date1 = new Date(this.cYear, this.cMonth, date + 1);
    if (date1 < new Date()) return true;
    return false
  }
  
  /**
   * Dates onClick behaviour
   * First click, select dateFrom, second click (if old) select dateFrom else select dateTo
   * third click, if both, select dateFrom and set dateTo to null
   * @param date: clicked date
   * @param row: row index to discard inactive (check if working by class:inactive is less expensive)
   * @param e: clicked html element itself
   */
  selectDates(date: number, row: number, e: Event){

    // make sure it only operates on active dates
    if (!this.isDisable(row, date)){
      
      const el = e.target as HTMLTableCellElement;

      if (this.dateTo || (!this.dateFrom && !this.dateTo)) this._clearFocus();
      
      if (this.dateTo) {
        this.service.dateTo.next(null); 
        this.service.dateFrom.next(null);
        this._clearFocus()
      }

      if (this.dateFrom && !this.dateTo && !el.classList.contains('inactive')){
        if (this._isNotOldDate(date)){
          this.service.dateTo.next(new Date(this.cYear, this.cMonth, date));
          el.classList.add('selectedCell');
          el.parentElement?.classList.add('dateTo');
        }
        else{
          this._clearFocus();
          this.service.dateFrom.next(new Date(this.cYear, this.cMonth, date));
          this.service.dateTo.next(null);
          el.classList.add('selectedCell');
          el.parentElement?.classList.add('dateFrom');
        }
      }
      else{
        this.service.dateFrom.next(new Date(this.cYear, this.cMonth, date));
        this.service.dateTo.next(null);
        el.classList.add('selectedCell');
        el.parentElement?.classList.add('dateFrom');
      }
    }
  }

  _isNotOldDate(date: number): boolean {
    const dateFrom = new Date(this.dateFrom!.getFullYear(), this.dateFrom!.getMonth(), this.dateFrom!.getDate() - 1);
    const newDate = new Date(this.cYear, this.cMonth, date);
    if (newDate <= dateFrom) return false;
    return true
  }

  _clearFocus(){
    const el = document.querySelectorAll('td');
    Array.from(el).forEach(x => {
      x.classList.remove('focus-active', 'dateFrom', 'dateTo')
    });
    const el1 = document.querySelectorAll('.dates');
    Array.from(el1).forEach(x => {
      x.classList.remove('selectedCell')
    })
  }

  /**
   * Highlight the area when datefrom is selected.
   * if checks are passed, the hovered date and all the dates prior to it until the dateFrom are highlighted
   * @param row: the index of the hovered row | used to discard the disabled dates1
   * @param date: the current hovered date
   * @param index: the current date in iteration 
   */
  isRange(row: number, date: number): void{
    if (this.dateFrom){
      if (!this.isDisable(row, date) && this._isNotOldDate(date) && !this.dateTo){
        const el = document.querySelectorAll('td');
        for (let i = 0; i < el.length; i++){
          el[i].classList.remove('focus-active');
          const index = Number(el[i].firstElementChild?.innerHTML); //target parent element to give backgraound to it but identifying it from the child for rounding the first and th last date
          if (new Date(this.cYear, this.cMonth, index) >= this.dateFrom! && index <= date){
            if(!el[i].classList.contains('inactive'))
            el[i].classList.add('focus-active')
          }
        }
      }
    }
  }

}