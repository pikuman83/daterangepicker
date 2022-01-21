import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public popUp = new Subject<boolean>();
  public dateFrom = new Subject<Date|null>();
  public dateTo = new Subject<Date|null>();
  public notify = new Subject<string>();

  runNotification(msg: string){
    this.notify.next('');
    this.notify.next(msg);
    setTimeout(() => {
      this.notify.next('')
    }, 3000);
  }

  firebaseApp = initializeApp(environment.firebase);
  db= getFirestore();
  async create(path: string, data: any){
    try {
      await addDoc(collection(this.db, path), data);
    } catch (e: any) {
      this.runNotification(e.message);
    }
  }

}
