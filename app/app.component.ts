import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  styles: ['.k-calendar { margin: 0 auto; }'],
  templateUrl: './view.html',
})
export class AppComponent {
  public listItems: Array<string> = [
    'Baseball',
    'Basketball',
    'Cricket',
    'Field Hockey',
    'Football',
    'Table Tennis',
    'Tennis',
    'Volleyball',
  ];
  public value: any = ['Baseball'];

  showConfig = false;
}
