import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'unblur Demo';
  isOPen = false;
  // add hostlisten to parent to turn isopen false
}
