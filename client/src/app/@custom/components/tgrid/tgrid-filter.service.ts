import {
  Injectable,
  Injector,
  ApplicationRef,
  ComponentRef,
  Renderer2,
  QueryList,
  ViewContainerRef
} from "@angular/core";
import { TGridItem } from "./models/tgrid-item";
import { TGridFilterComponent } from "./tgrid-filter/tgrid-filter.component";
import { TGridColumnComponent } from "./tgrid-column/tgrid-column.component";
import { TGridFilter } from "./models/tgrid-filter";
import { TGridOverlayComponent } from "./tgrid-overlay/tgrid-overlay.component";
import { TGridFilterMode } from "./models/tgrid-filter-mode";
import { filter } from "rxjs/operators";

@Injectable()
export class TGridFilterService {
  public data: TGridItem[];
  private _originalData: TGridItem[];
  private _columns: QueryList<TGridColumnComponent>;

  constructor(
    private _injector: Injector,
    private _appRef: ApplicationRef,
    private _renderer: Renderer2,
    private _vcRef: ViewContainerRef,
  ) { }

  public initializeData(
    data: TGridItem[],
    columns: QueryList<TGridColumnComponent>,
    original: TGridItem[]
  ): TGridItem[] {
    this.data = [...original];
    this._originalData = [...original];

    if (columns) {
      this._columns = columns;
      this.data = this.applyFilters(this.data, columns);
      return this.applyFilters(data, columns);
    }
    return this.data;
  }

  public createFilterPopover(column: TGridColumnComponent, element: HTMLElement): ComponentRef<TGridFilterComponent> {
    const overlayRef = this._createOverlay();
    const filterRef = this._createFilter(overlayRef);

    filterRef.instance.dataSource = column.filter;
    const rect = element.getBoundingClientRect();
    this._renderer.setStyle(filterRef.location.nativeElement, "left", `${rect.left}px`);
    this._renderer.setStyle(filterRef.location.nativeElement, "top", `${rect.top + rect.height}px`);
    this._renderer.setStyle(filterRef.location.nativeElement, "height", `calc(100% - ${rect.top + rect.height}px)`);

    filterRef.instance.applyFilter.subscribe((filter: TGridFilter[]) => {
      this.data = this.applyFilters(this._originalData, this._columns);
      this._destroy(overlayRef, filterRef);
    });

    filterRef.instance.resetFilter.subscribe(() => {
      this.data = [...this._originalData];
      this._destroy(overlayRef, filterRef);
    });

    overlayRef.instance.click.subscribe((e: MouseEvent) => {
      if (!e.composedPath().find((path) => path === filterRef.instance.elementRef.nativeElement)) {
        this._destroy(overlayRef, filterRef);
      }
    });

    return filterRef;
  }

  public applyFilters(items: TGridItem[], columns: QueryList<TGridColumnComponent>): TGridItem[] {
    const filters = columns.map((column) => {
      return {
        column: column.key,
        filterValues: column.filter.filter((item) => item.checked).map((item) => item.key),
        mode: column.filter.length ? column.filter[0].mode : null
      };
    });

    return items.filter((item) => {
      return filters.every((filter) => this._checkFilter(filter.column, filter.filterValues, item, filter.mode));
    });
  }

  private _checkFilter(key: string, filtersValue: string[], item: TGridItem, mode?: TGridFilterMode): boolean {
    if (!filtersValue.length) {
      return true;
    }

    const value = item.data[key].toString();
    if (Array.isArray(value)) {
      return filtersValue.reduce((bool, filterValue) => {
        return bool && value.indexOf(filterValue.toLocaleLowerCase()) > -1;
      }, true);
    }

    return filtersValue.some((i: any) => this._compare(value, i, mode));
  }

  public applyFilter(items: TGridItem[], key: string, filter: TGridFilter[]): TGridItem[] {
    const filtersValue = filter.filter((item) => item.checked).map((item) => item.key);

    return items.filter((item) => {
      const value = item.data[key];
      if (Array.isArray(value)) {
        return filtersValue.reduce((bool, filterValue) => {
          return bool && value.indexOf(filterValue) > -1;
        }, true);
      }

      return filtersValue.indexOf(value) > -1;
    });
  }

  public applyFilterValue(items: TGridItem[], key: string, filter: TGridFilter): TGridItem[] {
    return items.filter((item) => {
      const value: string = item.data[key];
      return this._compare(value, filter.key, filter.mode);
    });
  }

  public generateFilters(data: TGridItem[], column: TGridColumnComponent): TGridFilter[] {
    const filter = this._deserealizeFilter(column.filter);
    return Object.keys(
      data.reduce((prev, item) => {
        prev[item.data[column.key]] = false;
        return prev;
      }, {})
    ).map((key) => new TGridFilter(key, filter[key]));
  }

  private _deserealizeFilter(filter: TGridFilter[]): any {
    return filter.reduce((prev, item) => {
      prev[item.key] = item.checked;
      return prev;
    }, {});
  }

  private _createFilter(overlayRef: ComponentRef<TGridOverlayComponent>): ComponentRef<TGridFilterComponent> {
    const ref = this._vcRef.createComponent<TGridFilterComponent>(TGridFilterComponent, { injector: this._injector });

    this._renderer.appendChild(overlayRef.location.nativeElement, ref.location.nativeElement);
    ref.onDestroy(() => {
      this._appRef.detachView(ref.hostView);
    });

    return ref;
  }

  private _createOverlay(): ComponentRef<TGridOverlayComponent> {
    const ref = this._vcRef.createComponent<TGridOverlayComponent>(TGridOverlayComponent, { injector: this._injector });

    this._renderer.appendChild(document.body, ref.location.nativeElement);
    ref.onDestroy(() => {
      this._appRef.detachView(ref.hostView);
    });
    return ref;
  }

  private _destroy(
    overlayRef: ComponentRef<TGridOverlayComponent>,
    filterRef: ComponentRef<TGridFilterComponent>
  ): void {
    overlayRef.instance.click.unsubscribe();
    overlayRef.destroy();
    filterRef.destroy();
  }

  private _compare(value: string, filterValue: string, mode: TGridFilterMode): boolean {
    switch (mode) {
      case TGridFilterMode.Begin:
        return value.toString().toLowerCase().indexOf(filterValue.toLowerCase()) === 0;
      case TGridFilterMode.Contain:
        return value.toString().toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
      case TGridFilterMode.Equal:
        return value === filterValue;
    }
  }
}
