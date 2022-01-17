import { Component } from '@angular/core';
import { GlobalService } from './global.service';

export type DateRange = {
  dF: Date,
  dT: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'unblur Demo';
  isOPen = false;
  hide = true;

  constructor(public service: GlobalService){
    service.popUp.subscribe(close => this.hide = close)
  }

  // add hostlisten to parent to turn isopen false
  abc(dateRange: DateRange){
    console.log(dateRange.dF, dateRange.dT)
  }
}
