import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export interface HolidayConfigModel {
  text: string;
  value: number;
  isActive?: boolean;
  colorValue: string;
}

export function arrayRotateOne(arr: Array<any>, lenght: number): Array<any> {
  if (lenght) {
    // Right
    if (lenght > 0) {
      for (let i = 0; i < lenght; i++) {
        arr.unshift(arr.pop());
      }
    }
    // Left
    if (lenght < 0) {
      for (let i = 0; i < Math.abs(lenght); i++) {
        arr.push(arr.shift());
      }
    }
  }

  return arr;
}

@Component({
  selector: 'my-holiday-config',
  styles: ['.k-calendar { margin: 0 auto; }'],
  templateUrl: './view.html',
})
export class HolidayConfig implements AfterViewInit {
  @Output() public closeConfigWindow = new EventEmitter();
  @ViewChild('list') list;
  value: Array<{ text: string; value: number }> = [];
  public source: Array<HolidayConfigModel> = [
    {
      value: 1,
      text: 'Sarine',
      colorValue: null,
    },
    {
      value: 2,
      text: 'Willamina',
      colorValue: null,
    },
    {
      value: 3,
      text: 'Maribeth',
      colorValue: null,
    },
    {
      value: 4,
      text: 'Leoline',
      colorValue: null,
    },
    {
      value: 5,
      text: 'Pavia',
      colorValue: null,
    },
    {
      value: 6,
      text: 'Philis',
      colorValue: null,
    },
    {
      value: 7,
      text: 'Annadiane',
      colorValue: null,
    },
    {
      value: 8,
      text: 'Kerr',
      colorValue: null,
    },
    {
      value: 9,
      text: 'Alysa',
      colorValue: null,
    },
    {
      value: 10,
      text: 'Crystie',
      colorValue: null,
    },
  ];
  disableConfig = false;
  public data: Array<HolidayConfigModel>;
  public selectionCount = 0;
  public colorData = [
    '1#83a1c2',
    '2#B55F99',
    '3#26A299',
    '4#716ABA',
    '5#9E5A6A',
  ];

  lastColorSelectedIndex = 0;
  constructor() {
    this.source.forEach((v) => {
      v.isActive = true;
    });
    this.data = this.source.slice();
  }

  ngAfterViewInit() {
    const contains = (value) => (s) =>
      s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.list.toggle(true);
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

  onValueChange($event: Array<HolidayConfigModel>): void {
    if ($event.length === 5) {
      this.selectionCount += 1;
      this.lastColorSelectedIndex = this.getColorIndex(this.lastColorSelectedIndex, 'left');
      const unselectedIndex = [];
      this.source.forEach((v, index) => {
        if ($event.some((data) => v.value === data.value)) {
          unselectedIndex.push(index);
        }
      });
      console.log();
    } else {
      this.source = this.manupulateSourceAsperSelection(
        this.source,
        $event,
        this.selectionCount
      );
      if (this.selectionCount > $event.length) {
        if (this.lastColorSelectedIndex === 1) {
          this.lastColorSelectedIndex = 4;
        } else {
          this.lastColorSelectedIndex -= 1;
        }
      }
      console.log(
        this.source,
        this.selectionCount,
        this.lastColorSelectedIndex
      );
    }
  }

  getColorIndex(index: number, type: 'left' | 'right') {
    if (type === 'left') {
      if (index === 4) {
        return 0;
      } else {
        return (index += 1);
      }
    } else if (type === 'right') {
      if (index === 0) {
        return 4;
      } else {
        return (index -= 1);
      }
    }
  }

  manupulateSourceAsperSelection(
    source: Array<HolidayConfigModel>,
    selectionSet: Array<HolidayConfigModel>,
    selectionCount: number
  ) {
    source.forEach((data: HolidayConfigModel, index: number) => {
      data.isActive = true;
      if (selectionSet.some((selection) => selection.value === data.value)) {
        if (this.lastColorSelectedIndex === 5) {
          this.lastColorSelectedIndex = 0;
          data.colorValue = this.colorData[this.lastColorSelectedIndex];
        } else {
          this.lastColorSelectedIndex += 1;
          data.colorValue = this.colorData[this.lastColorSelectedIndex];
        }
      }
    });
    return source;
  }

  itemDisabled(itemArgs: {
    dataItem: HolidayConfigModel;
    index: number;
  }): boolean {
    return !itemArgs.dataItem.isActive;
  }

  preventClosingtheDropdown($event) {
    $event.preventDefault();
  }

  closeConfig() {
    this.closeConfigWindow.emit();
  }
}
