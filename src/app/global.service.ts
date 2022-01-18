import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public popUp = new Subject<boolean>();
  public dateFrom = new Subject<Date|null>();
  public dateTo = new Subject<Date|null>();

}
