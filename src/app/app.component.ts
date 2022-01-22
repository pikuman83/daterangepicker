import { Component, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'unblur Demo';
  isOPen = false;
  hide = true;
  notification = '';
  dateFrom!: Date|null;
  dateTo!: Date|null;
  dropdown = false;

  emailForm = {
    email: '',
    notes: '',
  };

  constructor(public service: GlobalService) {
    service.popUp.subscribe((closeCalendar) => (this.hide = closeCalendar));
    service.notify.subscribe((msg) => (this.notification = msg));
    // this.dateFrom = new Date(); 
    // this.onThisDay()
  }

  sendEmail(emailInput: NgModel) {
    // must check if dates are received
    if(emailInput.invalid && emailInput.errors?.['required']){
      this.service.runNotification('Email missing')
    }
    else if(emailInput.invalid && emailInput.errors?.['email']){
      this.service.runNotification('Invalid email format')
    }
    else{
      if (this.emailForm.email && this.emailForm.notes) {
        const msg = {
          to: this.emailForm.email,
          from: 'Wahab<wahab_anjum@hotmail.com>',
          bcc: 'pikuman10@gmail.com',
          message: {
            subject: `Event reminder`,
            html: `<h3>Greetings!!</h3><br>
            <p>Remeber your meeting with us from ${this.dateFrom!.getDate()}/
            ${this.dateFrom!.getMonth() + 1} till 
            ${this.dateTo!.getDate()}/${this.dateTo!.getMonth() + 1}</p><br>
            <strong>${this.emailForm.notes}!!</strong><br>
            Thank you very much for your attention.<br><br>Wahab`,
          },
        };
        try {
          this.service.create('contacts', msg).then(() => {
            (this.emailForm.email = ''), (this.emailForm.notes = '');
            this.service.runNotification(
              'Email Sent, please check your inbox and junk email'
            );
          });
        } catch (error: any) {
          this.service.runNotification(error.message);
        }
      }
    }
  }

  reset(){
    this.emailForm.email = ''; 
    this.emailForm.notes = '';
    this.dateFrom = null;
    this.dateTo = null

  }

  @HostListener('window:keydown', ['$event'])
  escape(e: any) {
    if (e.key === 'Escape' && !this.hide) {
      this.service.popUp.next(true);
    }
  }

  onThisDay(){
    if(this.dateFrom){
      this.service.get(this.dateFrom.getMonth()+1, this.dateFrom.getDate()).subscribe(x => console.log(x))
    }
  }

}

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
