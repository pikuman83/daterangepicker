import { Component, HostListener } from '@angular/core';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  title = 'Date range picker';
  hide = true;

  constructor(public service: GlobalService) {
    service.popUp.subscribe((closeCalendar) => (this.hide = closeCalendar));
  }

  @HostListener('window:keydown', ['$event'])
  escape(e: any) {
    if (e.key === 'Escape' && !this.hide) {
      this.service.popUp.next(true);
    }
  }

}

// clicking on app anywhere which doesnt contain app-calendar should close the calendar
// closeOnClick = 0;
//   @HostListener('click', ['$event']) offsetClose(e: any){
//     const x = e.target as HTMLElement;
//     console.log(e.composedPath().includes('app-calendar'));
//     if (!this.hide){
//       this.closeOnClick ++
//       if (this.closeOnClick === 2){
//         this.service.popUp.next(true);
//         this.closeOnClick = 0;
//       }
//     }
//   }
