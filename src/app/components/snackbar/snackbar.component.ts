import { Component } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent {

  notification = '';

  constructor(public service: GlobalService) {
    service.notify.subscribe((msg) => (this.notification = msg));
   }

}
