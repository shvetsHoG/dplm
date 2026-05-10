import { Directive, Renderer2, HostListener, OnDestroy } from "@angular/core";

@Directive({
    selector: "[appPopupDraggable]",
    standalone: false
})
export class PopupDraggableDirective implements OnDestroy {
  private readonly MOVE_DRAG_START = 0;
  private readonly MOUSEMOVE_EVENT = "mousemove";
  private readonly MOUSEUP_EVENT = "mouseup";

  private _dragStart: number;
  private _element: HTMLElement;
  private _currentOffsetX: number;
  private _currentOffsetY: number;
  private _diffX: number;
  private _diffY: number;

  @HostListener("mousedown", ["$event"]) onMouseDown(e: MouseEvent) {
    this._element = e.target as HTMLElement;

    if (!this._element.classList.contains("popup") || e.button !== 0) {
      return;
    }

    const translate = this._getComputedTranslateXY(this._element);
    this._currentOffsetY = e.clientY - translate[1];
    this._currentOffsetX = e.clientX - translate[0];
    this._dragStart = 0;

    document.addEventListener(this.MOUSEMOVE_EVENT, this._onMouseMove);
    document.addEventListener(this.MOUSEUP_EVENT, this._onMouseUp, { once: true });
  }

  constructor(private _renderer: Renderer2) {}

  ngOnDestroy() {
    this._renderer.removeClass(document.documentElement, "resizeable-active");
  }

  private _onMouseMove = (e: MouseEvent): void => {
    if (this._dragStart === this.MOVE_DRAG_START) {
      this._dragStart++;
      this._renderer.addClass(document.documentElement, "resizeable-active");
      return;
    }

    this._diffY = -(this._currentOffsetY - e.clientY);
    this._diffX = -(this._currentOffsetX - e.clientX);
    this._setTranslate(this._element, this._diffX, this._diffY);
  };

  private _onMouseUp = (e: MouseEvent): void => {
    document.removeEventListener(this.MOUSEMOVE_EVENT, this._onMouseMove);
    this._renderer.removeClass(document.documentElement, "resizeable-active");
  };

  private _setTranslate(el: HTMLElement, x: number, y: number): void {
    this._renderer.setStyle(el, "transform", `translate(${x}px, ${y}px)`);
  }

  private _getComputedTranslateXY(obj: HTMLElement): [number, number] {
    if (!window.getComputedStyle) {
      return;
    }

    const style = getComputedStyle(obj);
    const transform = style.transform;
    const mat = transform.match(/^matrix\((.+)\)$/);

    return [mat ? parseFloat(mat[1].split(", ")[4]) : 0, mat ? parseFloat(mat[1].split(", ")[5]) : 0];
  }
}
