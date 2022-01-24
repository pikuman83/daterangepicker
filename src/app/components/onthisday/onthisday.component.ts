import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-onthisday',
  templateUrl: './onthisday.component.html'
})

export class OnthisdayComponent implements OnInit {

  dropdown = false;
  dateFrom: Date|null = new Date(2020, 3, 2);
  facts!: any;
  
  constructor(private service: GlobalService) {
    service.dateFrom.subscribe(dF => {
      this.dateFrom = dF;
      this.onThisDay()
    });
   }

  ngOnInit(): void {this.onThisDay()}

  onThisDay(){
    if(this.dateFrom){
      this.service.get(this.dateFrom.getMonth() + 1, this.dateFrom.getDate())
        .subscribe((x:any) => {
          this.facts = x.selected[0];
      })
    }
  }

}
