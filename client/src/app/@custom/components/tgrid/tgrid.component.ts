import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ContentChildren,
  QueryList,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";

import { TGridColumnComponent } from "./tgrid-column/tgrid-column.component";
import { TGridSortDirection } from "./models/tgrid-sort-direction";
import { TGridItem } from "./models/tgrid-item";
import { TGridSelectMode } from "./models/tgrid-select-mode";
import { TGridFilter } from "./models/tgrid-filter";
import { TGridFilterService } from "./tgrid-filter.service";
import { TGridSortService } from "./tgrid-sort.service";
import { TGridFilterMode } from "./models/tgrid-filter-mode";

@Component({
  selector: "app-tgrid",
  templateUrl: "./tgrid.component.html",
  styleUrls: ["./tgrid.component.scss"],
  providers: [TGridFilterService, TGridSortService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TGridComponent implements OnInit, OnChanges, AfterViewInit {
  @ContentChildren(TGridColumnComponent) columns: QueryList<TGridColumnComponent>;
  @ViewChild("filterContainer", { read: ViewContainerRef }) filterContainer: ViewContainerRef;
  @ViewChild("grid") grid: ElementRef;
  @ViewChild("scrollChecker") scrollChecker: ElementRef<HTMLDivElement>;

  @Input() dataSource: any[];
  @Input() idExpr = "id";
  @Input() sortColumn: string;
  @Input() sortDirection: TGridSortDirection = TGridSortDirection.None;
  @Input() selectMode: TGridSelectMode = TGridSelectMode.None;
  @Input() singleDetail = true;
  @Input() height: string;
  @Input() paging: boolean;
  @Input() perPage = 20;
  @Input() dataLength: number;
  @Input() detailTemplate: TemplateRef<any>;
  @Input() clickable: boolean;
  @Input() autoWidth: boolean;
  @Input() rowClassKey: string;
  @Input() inlineFilter: boolean;
  @Input() rowControlTemplate: TemplateRef<any>;
  @Input() staticHeader: boolean;
  @Input() scrollAfterChangePage = true;
  @Input() scrollAfterPadding = 50;
  @Input() notAnimation: boolean;
  @Input() groupBy: string;
  @Input() groupName: string;
  @Input() lazyRender: boolean;
  @Input() serverSort: boolean;
  @Input() scrollStyle: boolean;
  @Input() tooltipRowKey: string;
  @Input() expandId: number | null = null;

  @Output() sortChange: EventEmitter<TGridColumnComponent> = new EventEmitter();
  @Output() selectionChange: EventEmitter<TGridItem[]> = new EventEmitter();
  @Output() rowClick: EventEmitter<TGridItem> = new EventEmitter();
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  public data: TGridItem[];
  public _data: TGridItem[];

  public lazyIndex = 0;

  public page = 1;

  private _originalDataSource: TGridItem[];
  private _selectedItems: TGridItem[] = [];
  public openedItems: TGridItem[] = [];

  public scrollTop: boolean;
  public scrollBottom: boolean;
  
  public groups: { [key: string]: TGridItem[] };
  public groupKeys: string[];

  @Input() checkDetail = (item: TGridItem) => true;

  constructor(
    private _elementRef: ElementRef,
    private _filterService: TGridFilterService,
    private _sortService: TGridSortService,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ("dataSource" in changes && this.dataSource) {
      this._initializeData(changes.dataSource.currentValue);
      if (this.lazyRender) {
        setTimeout(() => {
          this.listenIntersection();
        });
      }
    }
  }

  public listenIntersection() {
    const inter = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          this._lazyRender(10);
        }
      },
      {
        root: document.scrollingElement,
        rootMargin: "50px",
        threshold: 1.0
      }
    );

    inter.observe(this.scrollChecker.nativeElement);
  }

  public trackByFn(index: number, item: TGridItem): any {
    return item.id || index;
  }

  public trackColumnByFn(index: number, item: TGridColumnComponent): any {
    return item.key || index;
  }

  public trackGroupByFn(index: number, key: string): any {
    return key || index;
  }

  public scrollToTop() {
    setTimeout(() => {
      this._scrollToTop();
    });
  }

  public onChangePage(page: number): void {
    const last = this.page;
    this.page = page;
    const pagerStart = (page - 1) * this.perPage;
    const pagerEnd = pagerStart + this.perPage;
    this._data = this.data.slice(pagerStart, pagerEnd);
    if (!this._data.length && this.page > 1) {
      this.onChangePage(1);
    }

    if (this.scrollAfterChangePage && last !== page) {
      this._scrollToTop();
    }

    this.pageChange.emit(page);
  }

  public onClickSort(e: MouseEvent, column: TGridColumnComponent): void {
    if (column.allowSort) {
      this._applySort(column);
    }
  }

  public onClickFilter(e: MouseEvent, column: TGridColumnComponent): void {
    e.stopPropagation();
    this._applyFilter(e, column);
  }

  public onChangeFilter(value: string, column: TGridColumnComponent): void {
    if (!value) {
      column.filter = [];
    } else {
      const filter = new TGridFilter(value, true);
      filter.mode = TGridFilterMode.Begin;
      column.filter = [filter];
    }

    this._setDataSource(this._filterService.applyFilters(this._sortService.data, this.columns));
  }

  public onClickRow(e: MouseEvent, item: TGridItem, index: number): void {
    const selection = document.getSelection() as any;

    if (selection.extentOffset !== selection.baseOffset) {
      if (this._findChild(e.currentTarget, selection.anchorNode)) {
        return;
      } else {
        selection.empty();
      }
    }

    if (this.selectMode !== TGridSelectMode.None) {
      this.selectRow(item);
    }

    if (this.detailTemplate) {
      this.openDetail(item, index);
    }

    this.rowClick.emit(item);
  }

  public onClickCell(e: MouseEvent, column: TGridColumnComponent): void {
    if (column.notClickable) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  public selectByIndex(index: number): void {
    this.selectRow(this.data[0]);
  }

  public selectRow(item: TGridItem): void {
    switch (this.selectMode) {
      case TGridSelectMode.Single:
        if (this._selectedItems.length && this._selectedItems[0] === item) {
          item.selected = false;
          this._selectedItems.pop();
        } else if (this._selectedItems.length) {
          this._selectedItems[0].selected = false;
          item.selected = true;
          this._selectedItems.splice(0, 1, item);
        } else {
          item.selected = true;
          this._selectedItems.push(item);
        }

        this.selectionChange.emit(this._selectedItems);

        return;
      case TGridSelectMode.Multiple:
        const index = this._selectedItems.indexOf(item);
        if (index > -1) {
          this._selectedItems.splice(index, 1);
          item.selected = false;
        } else {
          this._selectedItems.push(item);
          item.selected = true;
        }

        this.selectionChange.emit(this._selectedItems);

        return;
    }
  }

  public openDetail(item: TGridItem, index: number): void {
    if (this.singleDetail) {
      if (this.openedItems.some((i: any) => i.id === item.id) && item.detail) {
        this.openedItems.pop();
        item.expand = false;
        this.expandId = null;
        return;
      }

      if (this.openedItems.length) {
        const prev = this.openedItems.pop();
        prev.expand = false;
        this.expandId = null;
      }

      item.expand = true;
      this.expandId = item.id;
      this.openedItems.push(item);
    } else {
      const prevIndex = this.openedItems.indexOf(item);
      if (prevIndex > -1) {
        item.expand = false;
        this.expandId = null;
        this.openedItems.splice(prevIndex, 1);
      } else {
        item.expand = true;
        this.expandId = item.id;
        this.openedItems.push(item);
      }
    }
  }

  private _initializeData(data: any[]): void {
    let dataSource: TGridItem[];
    const hasDataSource = Boolean(this._originalDataSource);
    dataSource = data.map((item, index) => new TGridItem(item[this.idExpr] || index, item, index));
    this._originalDataSource = [...dataSource];

    dataSource = this._sortService.initializeData(
      dataSource,
      this.sortColumn,
      this.sortDirection,
      this._originalDataSource
    );

    const filteredDataSource = this._filterService.initializeData(dataSource, this.columns, this._originalDataSource);

    if (hasDataSource) {
      dataSource = filteredDataSource;
    }

    if (this._selectedItems) {
      this._selectedItems.splice(0);
    }

    this._setDataSource(dataSource);
  }

  private _applySort(column: TGridColumnComponent): void {
    this.columns.forEach((item) => (item.sort = TGridSortDirection.None));
    this.sortDirection = this._sortService.getSortDirection(this.sortDirection, column.key, this.sortColumn);
    this.sortColumn = column.key;
    column.sort = this.sortDirection;

    if (!this.serverSort) {
      this._setDataSource(
        this._sortService.applySort(this.data, this.sortColumn, this.sortDirection, this._filterService.data)
      );
    }
    this.sortChange.emit(column);
  }

  private _applyFilter(e: MouseEvent, column: TGridColumnComponent): void {
    column.filter = this._filterService.generateFilters(this._sortService.data, column);

    const target = (e.currentTarget as HTMLElement).parentElement;
    const componentRef = this._filterService.createFilterPopover(column, target);

    componentRef.instance.applyFilter.subscribe((filter: TGridFilter[]) => {
      column.filterActive = true;
      this._setDataSource(this._filterService.applyFilters(this._sortService.data, this.columns));
    });

    componentRef.instance.resetFilter.subscribe(() => {
      column.filterActive = false;
      this._setDataSource([...this._sortService.data]);
    });
  }

  private _setDataSource(data: TGridItem[]): void {
    this.data = data;
    this._data = [];

    if (this.paging) {
      this.onChangePage(this.page);
      return;
    }

    if (this.lazyRender) {
      this._lazyRender(20);
      return;
    }

    this._data = data;
  }

  private _lazyRender(size = 10): void {
    this._data = this._data.concat(this.data.slice(this.lazyIndex + 1, this.lazyIndex + size));
    this.lazyIndex = this.lazyIndex + size;
    this._cdRef.detectChanges();
  }

  private _findChild(parent, child): boolean {
    let node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  private _scrollToTop(): void {
    const el: HTMLElement = this._elementRef.nativeElement;
    const container = this._findScrollParent(el.parentElement);
    const top = el.getBoundingClientRect().top;

    if (container && top < 0) {
      container.scrollTop = container.scrollTop + top - this.scrollAfterPadding;
    }
  }

  private _findScrollParent(node: HTMLElement) {
    if (node === null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this._findScrollParent(node.parentElement);
    }
  }
}
