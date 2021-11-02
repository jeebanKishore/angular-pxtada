import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { from } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';

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
