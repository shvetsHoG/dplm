import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterContentInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Optional
} from "@angular/core";
import { ThemeService } from "@custom/common/services/theme.service";
import { TooltipPosition } from "./models/tooltip-position";

@Component({
    selector: "app-tooltip",
    templateUrl: "./tooltip.component.html",
    styleUrls: ["./tooltip.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TooltipComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  @ViewChild("container", { static: true }) container: ElementRef;

  @Input() element: HTMLElement;
  @Input() position: TooltipPosition = TooltipPosition.Auto;
  @Input() template: TemplateRef<any>;
  @Input() data: any;
  @Input() content: string;
  @Input() id: string;
  @Input() scrollParent: HTMLElement;
  @Input() showArrow: boolean;

  public x: number;
  public xArrow: number;

  public y: number;
  public height: number;

  public posArrow: TooltipPosition;

  public space = 8;

  private _timeoutContentInit: number;
  private _timeoutViewInit: number;

  constructor(
    private _cdRef: ChangeDetectorRef,
    @Optional() public themeService: ThemeService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    clearTimeout(this._timeoutContentInit);
    clearTimeout(this._timeoutViewInit);
  }

  ngAfterContentInit() {
    if (this.template) {
      return;
    }

    this._timeoutContentInit = setTimeout(() => {
      this._calculatePosition();
    });
  }

  ngAfterViewInit() {
    if (!this.template) {
      return;
    }

    this._timeoutViewInit = setTimeout(() => {
      this._calculatePosition();
    });
  }

  public refresh(): void {
    this._calculatePosition();
  }

  private _calculatePosition(): void {
    switch (this.position) {
      case TooltipPosition.Top:
        this._topPosition();
        break;
      case TooltipPosition.Right:
        this._rightPosition();
        break;
      case TooltipPosition.Bottom:
        this._bottomPosition();
        break;
      default:
        this._topPosition();
    }
  }

  private _bottomPosition(): void {
    const container = this.container.nativeElement as HTMLElement;
    if (!this.element) {
      return;
    }

    const { left, top, width, height } = this.element.getBoundingClientRect();

    this.x = this.xArrow = left + width / 2 - container.offsetWidth / 2 + document.scrollingElement.scrollLeft;
    this.y = top + height + this.space;

    if (this.x < 8) {
      this.x = 8;
      this.xArrow = this.xArrow + this.x + container.offsetWidth / 2;
    } else if (this.x + container.offsetWidth > document.body.offsetWidth) {
      this.x -= this.x + container.offsetWidth - (document.body.offsetWidth - this.space);
      this.xArrow = this.xArrow - this.x + container.offsetWidth / 2;
    } else {
      this.xArrow = null;
    }

    this.posArrow = TooltipPosition.Bottom;
    this._cdRef.detectChanges();
  }

  private _topPosition(): void {
    const container = this.container.nativeElement as HTMLElement;
    if (!this.element) {
      return;
    }

    const { left, top, width } = this.element.getBoundingClientRect();

    this.x = this.xArrow = left + width / 2 - container.offsetWidth / 2 + document.scrollingElement.scrollLeft;
    this.y = top - container.offsetHeight - this.space;
    this.height = top - 8 * 2;

    this.y = this.y < 8 ? 8 : this.y;

    if (this.x < 8) {
      this.x = 8;
      this.xArrow = this.xArrow + this.x + container.offsetWidth / 2;
    } else if (this.x + container.offsetWidth > document.body.offsetWidth) {
      this.x -= this.x + container.offsetWidth - (document.body.offsetWidth - this.space);
      this.xArrow = this.xArrow - this.x + container.offsetWidth / 2;
    } else {
      this.xArrow = null;
    }

    this.posArrow = TooltipPosition.Top;
    this._cdRef.detectChanges();
  }

  private _rightPosition(): void {
    const container = this.container.nativeElement as HTMLElement;
    const { left, top, width, height } = this.element.getBoundingClientRect();

    this.x = left + width + this.space;
    this.y = top + height / 2 - container.offsetHeight / 2;

    if (this.y < 0) {
      this.y += 4;
    }

    this.posArrow = TooltipPosition.Right;
    this._cdRef.detectChanges();
  }
}
