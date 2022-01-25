import { Component } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-onthisday',
  templateUrl: './onthisday.component.html'
})

export class OnthisdayComponent {

  dropdown = false;
  dateFrom!: Date | null;
  facts!: any;

  constructor(private service: GlobalService) {
    this.service.dateFrom.subscribe(dF => {
      this.dateFrom = dF;
      if (dF) this.onThisDay()
      else this.facts = null;
    });
  }

  /**
   * Calls a public api through the get method on service.
   * The api retruns an array of random facts related to that date
   */
  onThisDay() {
    this.service.get(this.dateFrom!.getMonth() + 1, this.dateFrom!.getDate())
      .subscribe((x: any) => {
        if (x && x.selected) {
          const index = Math.floor(Math.random() * x.selected.length);
          this.facts = x.selected[index];
        }
      }), (err: Error) => {
        this.service.runNotification(err.message)
      }
  }

}
