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
export class AppComponent implements AfterViewInit {
  private list;

  @ViewChild('list') set content(content) {
    if (content) {
      console.log(content);
      // initially setter gets called with undefined
      this.list = content;
    }
  }
  public source: Array<{ text: string; value: number }> = [
    {
      value: 1,
      text: 'Sarine',
    },
    {
      value: 2,
      text: 'Willamina',
    },
    {
      value: 3,
      text: 'Maribeth',
    },
    {
      value: 4,
      text: 'Leoline',
    },
    {
      value: 5,
      text: 'Pavia',
    },
    {
      value: 6,
      text: 'Philis',
    },
    {
      value: 7,
      text: 'Annadiane',
    },
    {
      value: 8,
      text: 'Kerr',
    },
    {
      value: 9,
      text: 'Alysa',
    },
    {
      value: 10,
      text: 'Crystie',
    },
  ];

  public data: Array<{ text: string; value: number }>;

  showConfig = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.data = this.source.slice();
  }

  ngAfterViewInit() {
    const contains = (value) => (s) =>
      s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    console.log(this.list);
    this.list.filterChange
      .asObservable()
      .pipe(
        switchMap((value) =>
          from([this.source]).pipe(
            tap(() => (this.list.loading = true)),
            delay(1000),
            map((data) => data.filter(contains(value)))
          )
        )
      )
      .subscribe((x) => {
        this.data = x;
      });
  }

  showHideConfig(value) {
    this.showConfig = !value;
  }
}
