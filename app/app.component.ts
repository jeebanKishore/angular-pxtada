import { Component } from '@angular/core';
export interface DateModel {
  holidayName: String;
  holidayId: number;
  holidayList: Date[];
  dataAvilabilityPeriod: {
    fromDate: Date;
    toDate: Date;
  };
}
@Component({
  selector: 'my-app',
  styles: ['.k-calendar { margin: 0 auto; }'],
  templateUrl: './view.html',
})
export class AppComponent {
  showConfig = false;
  responce: DateModel[];
}
