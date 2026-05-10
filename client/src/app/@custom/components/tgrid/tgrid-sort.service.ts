import { Injectable } from "@angular/core";
import { TGridItem } from "./models/tgrid-item";
import { TGridSortDirection } from "./models/tgrid-sort-direction";

@Injectable()
export class TGridSortService {
  public data: TGridItem[];
  private _originalData: TGridItem[];

  constructor() {}

  public initializeData(
    data: TGridItem[],
    column: string,
    direction: TGridSortDirection,
    original: TGridItem[]
  ): TGridItem[] {
    this.data = [...original];
    this._originalData = original;

    if (column && direction) {
      this._sortOriginal(column, direction);
      return this.applySort(data, column, direction, data);
    }

    return this.data;
  }

  public applySort(
    items: TGridItem[],
    column: string,
    direction: TGridSortDirection,
    originItems: TGridItem[]
  ): TGridItem[] {
    this._sortOriginal(column, direction);
    return this._sort(items, column, direction, originItems);
  }

  public getSortDirection(current: TGridSortDirection, key: string, column: string): TGridSortDirection {
    if (key !== column) {
      return TGridSortDirection.Asc;
    }

    switch (current) {
      case TGridSortDirection.Asc:
        return TGridSortDirection.Desc;
      case TGridSortDirection.Desc:
        return TGridSortDirection.Asc;
      default:
        return TGridSortDirection.Asc;
    }
  }

  private _sortOriginal(sortColumn: string, sortDirection: TGridSortDirection): void {
    this.data = this._sort(this.data, sortColumn, sortDirection, this._originalData);
  }

  private _sort(
    items: TGridItem[],
    column: string,
    direction: TGridSortDirection,
    originItems: TGridItem[]
  ): TGridItem[] {
    if (direction === TGridSortDirection.None) {
      return (items = [...originItems]);
    }

    if (direction === TGridSortDirection.Asc) {
      items.sort((a, b) => {
        if (a.data[column] < b.data[column]) {
          return -1;
        }
        if (a.data[column] > b.data[column]) {
          return 1;
        }

        return 0;
      });
    }

    if (direction === TGridSortDirection.Desc) {
      items.sort((a, b) => {
        if (a.data[column] < b.data[column]) {
          return 1;
        }
        if (a.data[column] > b.data[column]) {
          return -1;
        }

        return 0;
      });
    }

    return items;
  }
}
