import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public popUp = new Subject<boolean>();
  public dateFrom = new Subject<Date|null>();
  public dateTo = new Subject<Date|null>();
  public notify = new Subject<string>();

  constructor(private http: HttpClient){}

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
  url = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected';
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'DateRangePicker/ Technical test for Unblur wahab_anjum@hotmail.com'
    }),
  };

  // This call can be can be made for limited number of returned items
  get(month: number = 3, day:number = 3): Observable<any> {
    return this.http.get<any>(`${this.url}/${month}/${day}`, this.httpOptions)
  }

}
