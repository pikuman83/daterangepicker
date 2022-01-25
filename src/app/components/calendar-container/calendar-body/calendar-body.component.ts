import {AfterViewChecked, Component, Input} from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.css'],
})

export class CalendarBodyComponent implements AfterViewChecked {

  @Input() cYear!: number;
  @Input() cMonth!: number;
  dateFrom!: Date | null;
  dateTo!: Date | null;
  weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  @Input() calendar: Array<Array<number>> = [];
  @Input() selectedDates!: boolean;

  constructor(public service: GlobalService) {
    service.dateFrom.subscribe((dF) => (this.dateFrom = dF));
    service.dateTo.subscribe((dT) => (this.dateTo = dT));
  }

  /**
   * Applies date selection through calendar navigation, When dates are already selected (selectedDates)
   * .inactive: disable dates
   * .dates: child div of the td (the date numeric)
   * .selectedCell: put the background to the div
   * .datefrom: round the first date's background
   * .dateto: round the last date's backgound
   * .focus-active: highlights the date range
   */
  ngAfterViewChecked(): void {
    if (this.dateFrom && this.dateTo && this.selectedDates) {
      const el = document.querySelectorAll('.dates');
      Array.from(el).forEach((x) => {

        const dateOnIndex = new Date(this.cYear, this.cMonth, Number(x.innerHTML));
        const td = x.parentElement!.classList;
        if (
          !td.contains('inactive') &&
          dateOnIndex.getFullYear() === this.dateFrom?.getFullYear() &&
          dateOnIndex.getMonth() === this.dateFrom.getMonth() &&
          dateOnIndex.getDate() === this.dateFrom.getDate()
        ) {
          x.classList.add('selectedCell');
          td.add('dateFrom');
        }
        if (
          !td.contains('inactive') &&
          dateOnIndex.getFullYear() === this.dateTo?.getFullYear() &&
          dateOnIndex.getMonth() === this.dateTo.getMonth() &&
          dateOnIndex.getDate() === this.dateTo.getDate()
        ) {
          x.classList.add('selectedCell');
          td.add('dateTo');
        }
        if (
          !td.contains('inactive') &&
          dateOnIndex >= this.dateFrom! &&
          dateOnIndex <= this.dateTo!
        ) {
          td.add('focus-active');
        }
      });
    }
  }

  /**
   * Adds a circle to today
   */
  isToday(row: number, date: number): boolean {
    if (!this.isDisable(row, date)) {
      const today = new Date();
      if (
        today.getDate() === date &&
        today.getFullYear() === this.cYear &&
        today.getMonth() === this.cMonth
      )
        return true;
    }
    return false;
  }

  /**
   * Checks if the date should be disabled (if belongs to the previous or next month and older than today)
   */
  isDisable(row: number | null, date: number): boolean {
    if (row === 0 && date > 7) return true; //porque en esta linea las fechas mayores solo pueden ser del mes pasado
    if ((row === 4 || row === 5) && date < 20) return true; //al contrario que la primera linea
    const date1 = new Date(this.cYear, this.cMonth, date + 1);
    if (date1 < new Date()) return true;
    return false;
  }

  /**
   * Dates onClick behaviour
   * First click, select dateFrom, second click (if older than dateFrom) select dateFrom else select dateTo
   * third click, if both, select dateFrom and set dateTo to null
   * @param date: clicked date
   * @param row: row index to discard inactive (check if working by class:inactive is less expensive)
   * @param e: clicked html element itself
   */
  selectDates(date: number, row: number, e: Event) {
    const el = e.target as HTMLTableCellElement;

    // make sure it only operates on active dates
    if (!this.isDisable(row, date) && el.nodeName === 'DIV') {

      // clear all on third click 
      if (this.dateTo) {
        this.service.dateTo.next(null);
        this.service.dateFrom.next(null);
        this._clearFocus();
      }

      // Second click behaviour, apply the relevant classes after several checks
      if (this.dateFrom && !this.dateTo && !el.classList.contains('inactive')) {
        if (this._isNotOldDate(date)) {
          this.service.dateTo.next(new Date(this.cYear, this.cMonth, date));
          el.classList.add('selectedCell');
          el.parentElement?.classList.add('dateTo');
        } else {
          // if an older than dateFrom is clicked, reselect dateFrom
          this._clearFocus();
          this.service.dateFrom.next(new Date(this.cYear, this.cMonth, date));
          this.service.dateTo.next(null);
          el.classList.add('selectedCell');
          el.parentElement?.classList.add('dateFrom');
        }
      } else {
        // First click behaviour
        this.service.dateFrom.next(new Date(this.cYear, this.cMonth, date));
        this.service.dateTo.next(null);
        el.classList.add('selectedCell');
        el.parentElement?.classList.add('dateFrom');
      }
    }
  }

  /**
   * Checks if the date is older than the dateFrom
   */
  _isNotOldDate(date: number): boolean {
    const dateFrom = new Date(
      this.dateFrom!.getFullYear(),
      this.dateFrom!.getMonth(),
      this.dateFrom!.getDate() - 1
    );
    const newDate = new Date(this.cYear, this.cMonth, date);
    if (newDate <= dateFrom) return false;
    return true;
  }

  /**
   * Clear all the selections and ranges
   */
  _clearFocus() {
    const el = document.querySelectorAll('td');
    Array.from(el).forEach((x) => {
      x.classList.remove('focus-active', 'dateFrom', 'dateTo');
    });
    const el1 = document.querySelectorAll('.dates');
    Array.from(el1).forEach((x) => {
      x.classList.remove('selectedCell');
    });
  }

  /**
   * Highlight the area when datefrom is selected.
   * if checks are passed, the hovered date and all the dates prior to it until the dateFrom are highlighted
   * @param row: the index of the hovered row | used to discard the disabled dates1
   * @param date: the current hovered date
   * @param index: the current date in iteration
   */
  isRange(row: number, date: number): void {
    if (this.dateFrom && !this.isDisable(row, date) && this._isNotOldDate(date) && !this.dateTo) {
      const el = document.querySelectorAll('td');
      // Make all the checks in a single iteration and add relevant classes
      for (let i = 0; i < el.length; i++) {
        const td = el[i].classList;
        td.remove('focus-active', 'dateFrom', 'dateTo');
        // child and parent elements used to round the background separately
        const index = Number(el[i].firstElementChild?.innerHTML);
        const indexDate = new Date(this.cYear, this.cMonth, index);
        if (indexDate >= this.dateFrom! && index <= date) {
          //hightlight dates between dF and dateTo
          if (
            indexDate.getFullYear() === this.dateFrom.getFullYear() &&
            indexDate.getMonth() === this.dateFrom.getMonth() &&
            indexDate.getDate() === this.dateFrom.getDate()
          ) 
            td.add('dateFrom');
          if (index === date) td.add('dateTo');
          if (!td.contains('inactive')) td.add('focus-active');
        }
      }
    }
  }
}