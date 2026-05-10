import {
  Directive,
  Input,
  Renderer2,
  ApplicationRef,
  HostListener,
  Injector,
  ComponentRef,
  TemplateRef,
  OnDestroy,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  ViewContainerRef
} from "@angular/core";
import { TooltipComponent } from "./tooltip.component";
import { TooltipService } from "./tooltip.service";
import { TooltipPosition } from "./models/tooltip-position";

@Directive({
  selector: "[tooltip]",
  standalone: false
})
export class TooltipDirective implements OnDestroy, OnInit {
  private _scrollListener: () => void;
  private _content: any;
  private _template: TemplateRef<any>;
  private _data: any;
  private _click: boolean;
  private _id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
  private _tooltipClick: boolean;
  private _tooltipFixClick: boolean;
  private _tooltipPosition: TooltipPosition = TooltipPosition.Auto;
  private _related: HTMLElement;
  private _tooltipShowArrow: boolean;
  private _tooltipTimeout: number;

  private _timeout: number;

  @Output() tooltipOpen = new EventEmitter<string>();
  @Output() tooltipClose = new EventEmitter<void>();

  @Input("tooltip") set tooltip(content: any) {
    if (!content) {
      this._content = null;
      return;
    }

    this._content = content;
  }

  @Input("tooltipTimeout") set tooltipTimeout(e: number) {
    this._tooltipTimeout = e;
  }

  @Input("tooltipFixClick") set tooltipFixClick(e: boolean) {
    this._tooltipFixClick = e;
  }

  @Input("tooltipShowArrow") set tooltipShowArrow(e: boolean) {
    this._tooltipShowArrow = e;
  }

  @Input("tooltipClick") set tooltipClick(e: boolean) {
    this._tooltipClick = e;
  }

  @Input("tooltipPosition") set tooltipPosition(e: TooltipPosition) {
    this._tooltipPosition = e;
  }

  @Input("tooltipTemplate") set tooltipTemplate(template: TemplateRef<any>) {
    this._template = template;
  }

  @Input("tooltipTemplateData") set tooltipTemplateData(data: any) {
    this._data = data;
  }

  @HostListener("mouseleave", ["$event"]) onMouseLeave(e: MouseEvent) {
    if (this._tooltipTimeout) {
      this._clearTimeout();
    }

    this._related = e.relatedTarget as HTMLElement;
    if (this._related && this._related.classList.contains("tooltip")) {
      this._related.removeEventListener("mouseleave", this._mouseLeaveRelated);
      this._related.addEventListener("mouseleave", this._mouseLeaveRelated);
      return;
    }

    if (this._service.has(this._id) && !this._click) {
      this._service.destroy(this._id);
    }
  }

  @HostListener("mousedown", ["$event"]) onMouseDown(e: MouseEvent) {
    if (!this._tooltipFixClick) {
      return;
    }

    e.stopPropagation();
    this._click = true;
  }

  @HostListener("mouseover", ["$event"]) onMouseOver(e: MouseEvent) {
    if (!this._content || this._service.has(this._id) || this._tooltipClick) {
      return;
    }

    const target = e.currentTarget as HTMLElement;

    if (this._tooltipTimeout) {
      this._clearTimeout();
      this._timeout = window.setTimeout(() => {
        this._service.set(this._id, this._createTooltip(target));
      }, this._tooltipTimeout);
      return;
    }

    this._service.set(this._id, this._createTooltip(target));
  }

  @HostListener("click", ["$event"]) onMouseClick(e: MouseEvent) {
    if (this._service.has(this._id)) {
      this._service.destroy(this._id);
      this._click = false;
      return;
    }

    if (!this._content || !this._tooltipClick || !this._tooltipFixClick || this._service.has(this._id)) {
      return;
    }
    this._click = true;

    this._service.set(this._id, this._createTooltip(e.currentTarget as HTMLElement));
  }

  constructor(
    private _renderer: Renderer2,
    private _appRef: ApplicationRef,
    private _elememtRef: ElementRef,
    private _injector: Injector,
    private _service: TooltipService,
    private _vcRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this._renderer.setAttribute(this._elememtRef.nativeElement, "id", this._id);
  }

  ngOnDestroy() {
    if (this._scrollListener) {
      this._scrollListener();
    }

    if (this._service.has(this._id)) {
      this._service.destroy(this._id);
    }
  }

  private _createTooltip(element: HTMLElement): ComponentRef<TooltipComponent> {
    const componentRef = this._vcRef.createComponent<TooltipComponent>(TooltipComponent, { injector: this._injector });

    componentRef.instance.element = element;
    componentRef.instance.content = this._content;
    componentRef.instance.data = this._data;
    componentRef.instance.template = this._template;
    componentRef.instance.position = this._tooltipPosition;
    componentRef.instance.showArrow = this._tooltipShowArrow;
    componentRef.instance.id = this._id;

    const parent = this._findScrollParent(element);
    if (parent) {
      componentRef.instance.scrollParent = parent;
      this._scrollListener = this._renderer.listen(parent, "scroll", () => this._service.destroy(this._id));
    }

    this._renderer.appendChild(document.body, componentRef.location.nativeElement);

    componentRef.onDestroy(() => {
      this._appRef.detachView(this._service.get(this._id).hostView);
      if (this._related) {
        this._related.removeEventListener("mouseleave", this._mouseLeaveRelated);
        this._related = null;
      }

      this._click = false;
      this.tooltipClose.emit();
    });

    this.tooltipOpen.emit(this._id);
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

  private _mouseLeaveRelated = (e: MouseEvent) => {
    const related = e.relatedTarget as HTMLElement;
    if (related === this._elememtRef.nativeElement) {
      return;
    }

    if (this._service.has(this._id) && !this._click) {
      this._service.destroy(this._id);
    }
  };

  private _clearTimeout(): void {
    if (this._timeout) {
      window.clearTimeout(this._timeout);
      this._timeout = null;
    }
  }
}
