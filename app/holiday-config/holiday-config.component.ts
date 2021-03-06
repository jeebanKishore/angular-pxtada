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
  styles: [
    `
  ::ng-deep .k-multiselect .k-multiselect-wrap li.k-button, .k-dropdowntree .k-multiselect-wrap li.k-button {
    display: none;
  }
  .k-multiselect .k-multiselect-wrap .k-searchbar, .k-dropdowntree .k-multiselect-wrap .k-searchbar {
    with:100%
  }
  `,
  ],
  templateUrl: './view.html',
})
export class HolidayConfig implements AfterViewInit {
  @Output() public closeConfigWindow = new EventEmitter();
  @ViewChild('list') list;
  value: Array<HolidayConfigModel> = [];
  public source: Array<HolidayConfigModel> = [
    {
      value: 1,
      text: 'US',
      colorValue: null,
    },
    {
      value: 2,
      text: 'India',
      colorValue: null,
    },
    {
      value: 3,
      text: 'UK',
      colorValue: null,
    },
    {
      value: 4,
      text: 'France',
      colorValue: null,
    },
    {
      value: 5,
      text: 'China',
      colorValue: null,
    },
    {
      value: 6,
      text: 'Japan',
      colorValue: null,
    },
    {
      value: 7,
      text: 'South Korea',
      colorValue: null,
    },
    {
      value: 8,
      text: 'Taiwan',
      colorValue: null,
    },
    {
      value: 9,
      text: 'Germany',
      colorValue: null,
    },
    {
      value: 10,
      text: 'Malaysia',
      colorValue: null,
    },
  ];
  public data: Array<HolidayConfigModel>;
  selectionCount = 0;
  public colorData = ['#83a1c2', '#B55F99', '#26A299', '#716ABA', '#9E5A6A'];
  constructor() {
    // To Do : If From server if we get n nos of Active items, mark all others as inactive
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
    debugger;
    console.log(
      this.list.hostElement.nativeElement.firstElementChild.children[1]
        .firstElementChild.placeholder
    );
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
      $event[$event.length - 1].colorValue = this.getColorValue(
        this.source,
        this.colorData
      );
      this.source.forEach((countryData: HolidayConfigModel, index: number) => {
        if (countryData.value === $event[$event.length - 1].value) {
          this.source[index] = $event[$event.length - 1];
        } else if (countryData.colorValue === null) {
          this.source[index].isActive = false;
        }
      });
    } else if ($event.length <= 4 && $event.length >= 1) {
      /**
       * If the selection have more value, add colorto newly selected items
       */
      if (this.selectionCount < $event.length) {
        this.selectionCount += 1;
        $event[$event.length - 1].colorValue = this.getColorValue(
          this.source,
          this.colorData
        );
        this.source.forEach(
          (countryData: HolidayConfigModel, index: number) => {
            if (countryData.value === $event[$event.length - 1].value) {
              this.source[index] = $event[$event.length - 1];
              this.source[index].isActive = true;
            }
          }
        );
      } else {
        /**
         * If selection have less nos of values, remove colorValue and
         * if previously selection was 5 and now reduced, mark all as active.
         */
        this.selectionCount -= 1;
        this.source.forEach(
          (countryData: HolidayConfigModel, index: number) => {
            if (
              !$event.some(
                (selection: HolidayConfigModel) =>
                  countryData.value === selection.value
              )
            ) {
              this.source[index].colorValue = null;
              this.source[index].isActive = true;
            }
          }
        );
      }
    } else if ($event.length === 0) {
      /**
       *If there is no item selected clear color data and mark all as active
       */
      this.selectionCount = 0;
      this.source.forEach((value) => {
        value.isActive = true;
        value.colorValue = null;
      });
    }
  }
  /**
   * @param source: Source Dataset
   * @param colorData: Color dataset
   * Parse the source dataset to extract first unused color and return it.
   */
  getColorValue(
    source: Array<HolidayConfigModel>,
    colorData: Array<string>
  ): string {
    let colorvalue = [];
    colorData.forEach((value, index) => {
      if (!source.some((countryData) => countryData.colorValue === value)) {
        colorvalue.push(index);
      }
    });
    return colorData[colorvalue[0]];
  }

  /**
   * Kendo reference to mark all isActive flags as inactive an not selectable
   */
  itemDisabled(itemArgs: {
    dataItem: HolidayConfigModel;
    index: number;
  }): boolean {
    return !itemArgs.dataItem.isActive;
  }
  /**
   * Stop closing th dropdown programmatically
   */
  preventClosingDropdown($event) {
    $event.preventDefault();
  }
  /**
   * On Click on icon emit event to parent to close the window
   */
  closeConfig() {
    this.closeConfigWindow.emit();
  }
}
