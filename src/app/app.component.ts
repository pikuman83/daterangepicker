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

  @HostListener('click', ['$event']) backDrop(e: any){
    const el = e.target as HTMLElement;
    if (el && el.classList.value === 'content'){
        this.service.popUp.next(true);
    }
  }

}
