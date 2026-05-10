import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from "@angular/core";

@Component({
    selector: "custom-paginator",
    templateUrl: "./paginator.component.html",
    styleUrls: ["./paginator.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Output() changePage: EventEmitter<number> = new EventEmitter();

  @Input() perPage: number;
  @Input() totalCount: number;
  @Input() pers: number[] = [20, 18, 30];
  @Input() aroundCount = 2;
  @Input() showPersSelect = false;
  @Input() isSingle: boolean;

  public countPages: number;
  public maxButons: number;
  public middleValue: number;
  public pages: number[] = [];
  public onSelectPage: (page: number) => void;

  public leftDots: number[];
  public rightDots: number[];
  public middlePages: number[];
  public leftPages: number[];
  public rightPages: number[];

  private _currentPage = 1;
  @Input() set currentPage(page: number) {
    if (this._currentPage === page) {
      return;
    }

    this._currentPage = page;
    this._initVariables();

    this.changePage.emit(page);
  }
  get currentPage(): number {
    return this._currentPage;
  }

  private _leftDots(): number[] {
    const middlePages = this._middlePages();
    const leftPages = this._leftPages();
    const rightPages = this._rightPages();

    if (!middlePages.length) {
      return;
    }

    if (this.currentPage < this.countPages - this.middleValue + 1) {
      const first = leftPages[leftPages.length - 1];
      const last = middlePages[0];
      return Array(last - first - 1)
        .fill(0)
        .map((x, i) => first + i + 1);
    } else {
      const first = leftPages[leftPages.length - 1];
      const last = rightPages[0];
      return Array(last - first - 1)
        .fill(0)
        .map((x, i) => first + i + 1);
    }
  }

  private _rightDots(): number[] {
    const middlePages = this._middlePages();
    const leftPages = this._leftPages();
    const rightPages = this._rightPages();

    if (!middlePages.length) {
      return;
    }

    if (this.currentPage > this.middleValue) {
      const first = middlePages[middlePages.length - 1];
      const last = rightPages[0];
      return Array(last - first - 1)
        .fill(0)
        .map((x, i) => first + i + 1);
    } else {
      const first = leftPages[leftPages.length - 1];
      const last = rightPages[0];
      return Array(last - first - 1)
        .fill(0)
        .map((x, i) => first + i + 1);
    }
  }

  private _leftPages(): number[] {
    if (this.maxButons >= 0 === false) {
      return [];
    }

    if (this.currentPage > this.middleValue) {
      return Array(this.aroundCount)
        .fill(0)
        .map((x, i) => i + 1);
    } else {
      return Array(this.maxButons - this.aroundCount + 1)
        .fill(0)
        .map((x, i) => i + 1);
    }
  }

  private _middlePages(): number[] {
    if (this.currentPage > Math.ceil(this.maxButons / 2) && this.currentPage < this.countPages - this.middleValue + 1) {
      return Array(this.aroundCount * 2 + 1)
        .fill(this.currentPage - this.aroundCount)
        .map((x, i) => x + i);
    } else {
      return [];
    }
  }

  private _rightPages(): number[] {
    if (this.maxButons >= 0 === false) {
      return [];
    }

    if (this.currentPage > this.countPages - this.middleValue) {
      return Array(this.maxButons - this.aroundCount + 1)
        .fill(this.countPages)
        .map((x, i) => x - i)
        .reverse();
    } else {
      return Array(this.aroundCount)
        .fill(this.countPages)
        .map((x, i) => x - i)
        .reverse();
    }
  }

  constructor(private _cd: ChangeDetectorRef) {
    this.onSelectPage = this.selectPage.bind(this);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ("totalCount" in changes) {
      this._initVariables();
    }
  }

  public onChangePer(per: string): void {
    this.perPage = +per;
    this._initVariables();
  }

  public onClick(page: number): void {
    this.currentPage = page;
  }

  public selectPage(page: number): void {
    this.currentPage = page;
  }

  public onSearchPage(e: number): void {
    if (+e > this.pages.length) {
      this.onClick(this.pages.length);
      return;
    }

    if (+e < 0) {
      this.onClick(1);
      return;
    }

    this.onClick(+e);
  }

  private _initVariables(): void {
    if (!this.totalCount) {
      return;
    }

    if (!this.perPage) {
      this.perPage = this.pers[0];
    }

    this.countPages = Math.ceil(this.totalCount / this.perPage);
    this.pages = Array(this.countPages)
      .fill(0)
      .map((x, i) => i + 1);
    this.maxButons = this.aroundCount * 4 + 1;
    this.middleValue = Math.ceil(this.maxButons / 2);

    if (this.currentPage > this.countPages) {
      this.currentPage = this.countPages;
    }

    this.leftDots = this._leftDots();
    this.rightDots = this._rightDots();
    this.middlePages = this._middlePages();
    this.leftPages = this._leftPages();
    this.rightPages = this._rightPages();
  }
}
