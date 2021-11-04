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
  public colorData = ['#83a1c2', '#B55F99', '#26A299', '#716ABA', '#9E5A6A'];
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
    console.log($event);
    if ($event.length >= 5) {
      this.source.forEach((v) => {
        if ($event.some((data) => v.value === data.value)) {
          v.isActive = true;
        } else {
          v.isActive = false;
          v.colorValue = null;
        }
      });
    } else {      
      this.source.forEach((v) => {
        v.isActive = true;
        if ($event.some((data) => v.value === data.value)) {
          v.isActive = true;
          v.colorValue = this.colorData[0];
          this.rotateColordata('left');
        }
      });
    }
  }

  manupulateSourceAsperSelection(source, selection){
    
  }

  rotateColordata(diraction: string) {
    if (diraction === 'left') {
      this.colorData.push(this.colorData.shift());
    } else if (diraction === 'left') {
      this.colorData.unshift(this.colorData.pop());
    }
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
