import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface HolidayConfigModel {
  text: string;
  value: number;
  isActive?: boolean;
  colorValue: string;
}

@Component({
  selector: 'my-holiday-config',
  styles: ['.k-calendar { margin: 0 auto; }'],
  templateUrl: './view.html',
})
export class HolidayConfig implements AfterViewInit {
  @Output() public closeConfigWindow = new EventEmitter();
  @ViewChild('list') list;
  value: Array<HolidayConfigModel> = [];
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
    '0#83a1c2',
    '1#B55F99',
    '2#26A299',
    '3#716ABA',
    '4#9E5A6A',
  ];

  lastColorSelectedIndex = this.colorData.length - 1;
  constructor() {
    // To Do : If From server if we get 5 nos of Active items, mark all others as inactive
    this.source.forEach((v) => {
      v.isActive = true;
    });
    this.data = this.source.slice();
  }

  ngAfterViewInit() {
    //Find typed string from collection
    const contains = (value) => (stringData) =>
      stringData.text.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    //Open the Dropdown permanately.
    this.list.toggle(true);
    //Listen to input box changes to give out filtered data.
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
  /**
   * Listen to checkbox selection changes
   * @param: $event = collection of selected check box data
   */
  onValueChange($event: Array<HolidayConfigModel>): void {
    const unselectedIndex = [];
    /**
     * If event length is 5 we have to disable the other remaining selections.
     */
    if ($event.length === 5) {
      this.selectionCount += 1;
      this.lastColorSelectedIndex = this.getColorIndex(
        this.lastColorSelectedIndex,
        'left'
      );
      this.source = this.manupulateSourceAsperSelection(
        this.source,
        $event[$event.length - 1],
        this.colorData[this.lastColorSelectedIndex]
      );
      /**
       * We have to clear all other items and mark them as inactive
       */
      this.clearColorValueFromUnselectedItems(this.source, $event, true, false);
    } else if ($event.length <= 4 && $event.length >= 1) {
      if (this.selectionCount > $event.length) {
        this.selectionCount -= 1;
        this.clearColorValueFromUnselectedItems(
          this.source,
          $event,
          false,
          true
        );
      } else {
        this.selectionCount += 1;
        this.lastColorSelectedIndex = this.getColorIndex(
          this.lastColorSelectedIndex,
          'left'
        );
        this.source = this.manupulateSourceAsperSelection(
          this.source,
          $event[$event.length - 1],
          this.colorData[this.lastColorSelectedIndex]
        );
      }
    } else if ($event.length === 0) {
      this.selectionCount = 0;
      this.lastColorSelectedIndex = 0;
      this.source.forEach((value) => {
        value.isActive = true;
        value.colorValue = null;
      });
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
    selectionSet: HolidayConfigModel,
    colorValue: string
  ) {
    source.forEach((data: HolidayConfigModel) => {
      data.isActive = true;
      if (selectionSet.value === data.value) {
        data.colorValue = colorValue;
      }
    });
    return source;
  }

  clearColorValueFromUnselectedItems(
    source: Array<HolidayConfigModel>,
    selectedItems: Array<HolidayConfigModel>,
    deactivateRemaining: boolean,
    activateRemaining: boolean
  ) {
    const unselectedIndex = [];
    source.forEach((v, index) => {
      if (!selectedItems.some((data) => v.value === data.value)) {
        unselectedIndex.push(index);
      }
    });
    if (unselectedIndex.length > 0) {
      unselectedIndex.forEach((value) => {
        this.source[value].colorValue = null;
        if (deactivateRemaining === true) {
          this.source[value].isActive = false;
        }
        if (activateRemaining === true) {
          this.source[value].isActive = true;
        }
      });
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
