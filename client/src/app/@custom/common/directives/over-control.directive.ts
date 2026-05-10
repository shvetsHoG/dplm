import {
  Directive,
  Renderer2,
  HostListener,
  Input,
  TemplateRef,
  ElementRef,
  EmbeddedViewRef,
  OnDestroy,
  ApplicationRef
} from "@angular/core";

@Directive({
    selector: "[appOverControl]",
    standalone: false
})
export class OverControlDirective implements OnDestroy {
  private _templateControl: TemplateRef<any>;
  private _view: EmbeddedViewRef<any>;
  private _data: any;
  private _active: boolean;
  private _hidden: boolean;
  private _elementRef: ElementRef;

  @HostListener("mouseover") onMouseOver() {
    if (!this._templateControl || this._view || this._active || this._hidden) {
      return;
    }

    let elem: Element = this._elementRef.nativeElement;
    this._view = this._templateControl.createEmbeddedView({ data: this._data });

    if (elem.tagName === "TR") {
      elem = elem.lastElementChild;
    }
    this._renderer.appendChild(elem, this._view.rootNodes[0]);
    this._appRef.attachView(this._view);
  }

  @HostListener("mouseleave") onMouseLeave() {
    if (!this._templateControl || !this._view || this._active) {
      return;
    }

    this._appRef.detachView(this._view);
    this._view.destroy();
    this._view = null;
  }

  @Input("appOverControl") set appOverControl(template: TemplateRef<any>) {
    this._templateControl = template;
  }

  @Input("appOverControlHidden") set appOverControlHidden(bool: boolean) {
    this._hidden = bool;
  }

  @Input("appOverControlActive") set appOverControlActive(bool: boolean) {
    if (this._hidden) {
      return;
    }

    this._active = bool;

    if (bool && !this._view) {
      // this._view = this._viewRef.createEmbeddedView(this._templateControl, { data: this._data });
      this._renderer.appendChild(this._elementRef.nativeElement, this._view.rootNodes[0]);
    }
    if (!bool && this._view) {
      this._view.destroy();
      this._view = null;
    }
  }

  @Input("appOverControlData") set appOverControlData(data: any) {
    this._data = data;
  }

  constructor(
    private _renderer: Renderer2,
    private _appRef: ApplicationRef,
    _elementRef: ElementRef
  ) {
    this._elementRef = _elementRef;
  }

  ngOnDestroy() {
    if (this._view) {
      this._view.destroy();
      this._view = null;
    }
  }
}
