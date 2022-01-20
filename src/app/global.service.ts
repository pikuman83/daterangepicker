import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public popUp = new Subject<boolean>();
  public dateFrom = new Subject<Date|null>();
  public dateTo = new Subject<Date|null>();
  public notify = new Subject<string>();

  // constructor(private db: AngularFirestore){}

  runNotification(msg: string){
    this.notify.next('');
    this.notify.next(msg);
    setTimeout(() => {
      this.notify.next('')
    }, 3000);
  }

  // create(path: string, data: any): any {
  //   return this.db.collection(`/${path}`).add({ ...data });
  // }

}
