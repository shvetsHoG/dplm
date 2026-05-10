import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  Type,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  HostListener,
  ElementRef,
  Optional
} from "@angular/core";
import { ThemeService } from "@custom/common/services/theme.service";

@Component({
    selector: "app-overlay",
    templateUrl: "./overlay.component.html",
    styleUrls: ["./overlay.component.scss"],
    standalone: false
})
export class OverlayComponent<T> implements OnInit {
  @ViewChild("overlay", { static: true }) overlay: ElementRef<HTMLElement>;

  @ViewChild("container", { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  @Output() clickOverlay: EventEmitter<void> = new EventEmitter();
  @Output() contentReady: EventEmitter<T> = new EventEmitter();

  @Input() positionX: number;
  @Input() positionY: number;
  @Input() zIndex: number;
  @Input() component: Type<T>;
  @Input() parent: HTMLElement;
  @Input() pure: boolean;
  @Input() theme: "outlined" | "filled" | "underlined" = "outlined";

  @Input() isAnimated = true;
  @Input() width: number;
  @Input() height: number;
  @Input() heightPx: number;
  @Input() overflowY: "auto" | "hidden" | "scroll" | "visible" = "auto";

  public positionBottomY: number;
  public positionTopY: number;
  private _isClosed: boolean;

  public componentRef: ComponentRef<T>;

  @HostListener("window:resize") onResize() {
    this.resize();
  }

  @HostListener("document:wheel", ["$event"]) onTouchWindow(e: Event) {
    const hasOverlay = e
      .composedPath()
      .some((i: HTMLElement) => i.classList && i.classList.contains("overlay-popover"));

    if (this._isClosed && hasOverlay) {
      return;
    }

    if (!hasOverlay) {
      this.close();
    }
  }

  @HostListener("document:mousedown", ["$event"]) onMosueDown(e: Event) {
    for (const el of e.composedPath() as HTMLElement[]) {
      if ((el.classList && el.classList.contains("overlay-popover")) || el === this.parent) {
        return;
      }
    }

    this.close();
  }

  constructor(@Optional() public themeService: ThemeService) {}

  ngOnInit() {
    this.componentRef = this.container.createComponent(this.component);
    this.contentReady.emit(this.componentRef.instance);
  }

  public onClick(e: MouseEvent): void {
    e.stopPropagation();

    if (!(e.target as HTMLElement).classList.contains("overlay")) {
      return;
    }

    this.close();
  }

  public close(): void {
    this._isClosed = true;
    if (!this.isAnimated) {
      this.clickOverlay.emit();
      return;
    }
    this.overlay.nativeElement.classList.add("overlay-popover-destroy");
    this.overlay.nativeElement.addEventListener(
      "animationend",
      () => {
        this.clickOverlay.emit();
      },
      { once: true }
    );

    this.overlay.nativeElement.style.animation = "none";
    setTimeout(() => {
      this.overlay.nativeElement.style.animation = null;
    });
  }

  public resize(): void {
    const { left, top, height } = this.parent.getBoundingClientRect();

    this.positionX = left + document.scrollingElement.scrollLeft;

    if (top + height > document.body.offsetHeight - 200) {
      this.positionBottomY = document.body.offsetHeight - top;
      this.positionTopY = null;
    } else {
      this.positionBottomY = null;
      this.positionTopY = top + this.parent.scrollTop + height;
    }
  }
}
