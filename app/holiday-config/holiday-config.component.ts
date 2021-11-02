import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'my-holiday-config',
  styles: ['.k-calendar { margin: 0 auto; }'],
  templateUrl: './view.html',
})
export class HolidayConfig implements AfterViewInit {
  @ViewChild('list') list;

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

  constructor() {
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
          from([this.source]).pipe(map((data) => data.filter(contains(value))))
        )
      )
      .subscribe((x) => {
        this.data = x;
      });
  }
}
