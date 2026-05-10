import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  OnDestroy,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  HostBinding
} from "@angular/core";
import { filter, map, share, takeUntil } from "rxjs/operators";
import { SvgIconService } from "./svg-icon.service";
import { Subject, Subscription } from "rxjs";

@Component({
    selector: "custom-svg-icon",
    template: "",
    styleUrls: ["./svg-icon.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SvgIconComponent implements OnDestroy, OnChanges {
  private readonly STROKE_WIDTH = "stroke-width";
  private readonly HEIGHT = "height";
  private readonly WIDTH = "width";
  private readonly FILL = "fill";
  private readonly STROKE = "stroke";
  private readonly STYLE_OVERRIDE_CLASS = "style-override";

  @Output() iconClick: EventEmitter<any> = new EventEmitter<any>();

  @Input() icon: string;
  @Input() fill: string;
  @Input() active: boolean;
  @Input() stroke: string;
  @Input() strokeWidth: string;
  @Input() iconHeight: string;
  @Input() iconWidth: string;
  @Input() fillSvg: string;
  @Input() className = "";
  @Input() disabled: boolean;
  @Input() alt: string;
  @Input() clickable: boolean;

  @Input() value: number;

  public element: SVGElement;
  private _destroy$ = new Subject();
  private _getSvgSubs: Subscription;

  @HostBinding("class.disabled") get isDisabled() {
    return this.disabled;
  }
  @HostBinding("class.active") get isActive() {
    return this.active;
  }

  constructor(
    private _service: SvgIconService,
    public elementRef: ElementRef,
    private _renderer: Renderer2
  ) { }

  ngOnDestroy() {
    if (this.element && this.iconClick) {
      this.elementRef.nativeElement.removeEventListener("click", this.iconClicked);
    }

    this._destroy$.next(null);
    this._destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.icon && changes.icon.currentValue) {
      if (this._getSvgSubs) {
        this._getSvgSubs.unsubscribe();
      }

      this._getSvgSubs = this._service
        .getSvg(this.icon)
        .pipe(
          filter((element) => element !== null),
          share(),
          map((element) => this._setAttrs(element)),
          takeUntil(this._destroy$)
        )
        .subscribe(
          (svg) => {
            if (this.iconClick.observers.length > 0 || this.clickable) {
              this.elementRef.nativeElement.removeEventListener("click", this.iconClicked);
              this.elementRef.nativeElement.addEventListener("click", this.iconClicked);
              this._renderer.addClass(this.elementRef.nativeElement, "clickable");
              if (this.disabled) {
                this._renderer.addClass(this.elementRef.nativeElement, "disabled");
              }
            }
            this.element = svg;
            if (!this.value) {
              this.elementRef.nativeElement.innerHTML = "";
            }

            this._renderer.appendChild(this.elementRef.nativeElement, this.element);
          },
          (e) => {
            if (this.alt) {
              this.elementRef.nativeElement.innerHTML = this.alt;
              return;
            }

            console.warn(e);
          }
        );
    }
    if (this.element) {
      this._setAttrs(this.element);
    }
    if (changes.className && changes.className.currentValue && this.element) {
      if (changes.className.previousValue) {
        this._renderer.removeClass(this.element, changes.className.previousValue);
      }

      this._renderer.addClass(this.element, changes.className.currentValue);
    }
    if (changes.active && this.elementRef) {
      if (this.active) {
        this._renderer.addClass(this.elementRef.nativeElement, "active");
      } else {
        this._renderer.removeClass(this.elementRef.nativeElement, "active");
      }
    }
    if (changes.value && this.value > 0) {
      const childElements = this.elementRef.nativeElement.children;
      for (let child of childElements) {
        if (child.nodeName === "DIV") {
          this._renderer.removeChild(this.elementRef.nativeElement, child);
        }
      }
      const div = this._renderer.createElement("div");
      const value = this._renderer.createText(this.value > 99 ? "99+" : this.value.toString());
      this._renderer.addClass(div, "value");
      if (this.value > 99) {
        this._renderer.addClass(div, "value-large");
      }
      this._renderer.appendChild(div, value);
      this._renderer.appendChild(this.elementRef.nativeElement, div);
    }

    if (changes.value && this.value === 0) {
      while (
        this.elementRef.nativeElement.lastElementChild &&
        this.elementRef.nativeElement.lastElementChild.className === "value"
      ) {
        this.elementRef.nativeElement.lastElementChild.remove();
      }
    }
  }

  public iconClicked = (e: MouseEvent): void => {
    if (this.disabled) {
      return;
    }

    this.iconClick.emit(e);
  };

  public addClassName(className: string): void {
    this._renderer.addClass(this.element, className);
    this.className = className;
  }

  public removeClassName(className: string): void {
    this._renderer.removeClass(this.element, className);
    this.className = "";
  }

  private _setAttrs(element: SVGElement): SVGElement {
    if (this.strokeWidth) {
      this._renderer.setStyle(element, this.STROKE_WIDTH, this.strokeWidth);
    }

    if (this.iconHeight) {
      this._renderer.setStyle(element, this.HEIGHT, this.iconHeight);
    }

    if (this.iconWidth) {
      this._renderer.setStyle(element, this.WIDTH, this.iconWidth);
    }

    if (this.className) {
      this._renderer.addClass(element, this.className);
    }

    if (this.fillSvg) {
      this._renderer.setStyle(element, this.FILL, this.fillSvg);
    }

    if (this.fill || this.stroke) {
      for (let i = 0; i < element.children.length; i++) {
        if (element.children.item(i).classList.contains(this.STYLE_OVERRIDE_CLASS)) {
          this._renderer.setStyle(element.children.item(i), this.FILL, this.fill);
          this._renderer.setStyle(element.children.item(i), this.STROKE, this.stroke);
        }
      }
    }

    return element;
  }
}
