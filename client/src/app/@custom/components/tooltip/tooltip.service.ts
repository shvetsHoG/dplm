import {
  Injectable,
  ComponentRef,
  Injector,
  ApplicationRef,
  Renderer2,
  RendererFactory2,
} from "@angular/core";
import { TooltipComponent } from "./tooltip.component";
import { ViewContainerService } from "@core/services/view-container.service";

@Injectable({
  providedIn: "root"
})
export class TooltipService {
  private _tooltips: Map<string, ComponentRef<TooltipComponent>> = new Map();

  private _scrollListener: () => void;

  private _renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _viewContainerService: ViewContainerService,
  ) {
    document.addEventListener("wheel", this._onScrollWindow);
    document.addEventListener("mousedown", this._onMosueDown);

    this._renderer = rendererFactory.createRenderer(null, null);
  }

  public refresh(id: string): void {
    if (!this._tooltips.has(id)) {
      return;
    }

    this._tooltips.get(id).instance.refresh();
  }

  public get(id: string): ComponentRef<TooltipComponent> {
    return this._tooltips.get(id);
  }

  public set(id: string, ref: ComponentRef<TooltipComponent>): void {
    this._tooltips.set(id, ref);
  }

  public has(id: string): boolean {
    return this._tooltips.has(id);
  }

  public destroy(id: string): void {
    if (!this._tooltips.has(id)) {
      return;
    }

    this._tooltips.get(id).destroy();
    this._tooltips.delete(id);
  }

  public openTooltip(target, obj): void {
    this._createTooltip(target, obj);
  }

  private _onMosueDown = (e: Event): void => {
    if (this._tooltips.size && this._isOutEvent(e)) {
      this._destroy();
    }
  };

  private _onScrollWindow = (e: Event): void => {
    if (this._tooltips.size && this._isOutEvent(e)) {
      this._destroy();
    }
  };

  private _isOutEvent(e: Event): boolean {
    return !e.composedPath().some((i: any) => i.classList && i.classList.contains("tooltip"));
  }

  private _destroy(): void {
    this._tooltips.forEach((i: any) => i.destroy());
    this._tooltips.clear();
  }

  private _createTooltip(element: HTMLElement, object): ComponentRef<TooltipComponent> {
    const componentRef = this._viewContainerService.vcr?.createComponent<TooltipComponent>(TooltipComponent, { injector: this._injector });

    const _id = `f${(~~(Math.random() * 1e8)).toString(16)}`;

    componentRef.instance.element = element;
    componentRef.instance.content = object.content;
    componentRef.instance.data = object.data;
    componentRef.instance.template = object.template;
    componentRef.instance.position = object.tooltipPosition;
    componentRef.instance.showArrow = object.tooltipShowArrow;
    componentRef.instance.id = _id;

    this.set(_id, componentRef);

    const parent = this._findScrollParent(element);
    if (parent) {
      componentRef.instance.scrollParent = parent;
      this._scrollListener = this._renderer.listen(parent, "scroll", () => this.destroy(_id));
    }

    this._renderer.listen(element, "mouseleave", () => this.destroy(_id));

    this._renderer.appendChild(document.body, componentRef.location.nativeElement);
    return componentRef;
  }

  private _findScrollParent(node: HTMLElement) {
    if (node === null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) {
      return node;
    } else {
      return this._findScrollParent(node.parentElement);
    }
  }
}
