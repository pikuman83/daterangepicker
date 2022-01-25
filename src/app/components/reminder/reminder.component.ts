import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent {

  dateFrom!: Date|null;
  dateTo!: Date|null;
  dropdown = false;

  emailForm = {
    email: '',
    notes: '',
  };

  constructor(private service: GlobalService) { 
    service.dateFrom.subscribe(dF => this.dateFrom = dF);
    service.dateTo.subscribe(dT => this.dateTo = dT);
  }

  sendEmail(emailInput: NgModel) {
    if (this._isValid(emailInput)) {
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
      this._submit(msg);
    }
  }

  _isValid(emailInput: NgModel){
    if (this.dateFrom && this.dateTo) {
      if(emailInput.invalid && emailInput.errors?.['required']){
        this.service.runNotification('Email missing');
        return false
      }
      else if(emailInput.invalid && emailInput.errors?.['email']){
        this.service.runNotification('Invalid email format');
        return false
      }
      return true
    }
    else return false
  }

  _submit(msg: any){
    try {
      this.service.create('contacts', msg).then(() => {
        this.service.runNotification('Email Sent, please check your inbox and junk email');
        this.reset();
        this.dropdown = false;
      });
    } catch (error: any) {
      this.service.runNotification(error.message);
    }
  }

  reset(){
    this.emailForm.email = ''; 
    this.emailForm.notes = '';
  }

}
