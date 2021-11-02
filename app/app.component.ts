import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  styles: ['.k-calendar { margin: 0 auto; }'],
  templateUrl: './view.html',
})
export class AppComponent {
  showConfig = false;

  showHideConfig(value) {
    this.showConfig = !value;
  }
}
