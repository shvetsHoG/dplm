import { Directive, HostListener, ElementRef, Input, OnInit, Renderer2, EventEmitter } from "@angular/core";

@Directive({
    selector: "[paginatorDots]",
    standalone: false
})
export class PaginatorDirective implements OnInit {
  @HostListener("click") onClick() {
    if (this._active) {
      return;
    }

    const option: AddEventListenerOptions = { once: true };

    this.select.options[0] = this._createOption(this._defaultValue);

    this.paginatorDots.forEach((page: number, index: number) => {
      this.select.options[index + 1] = this._createOption(page.toString());
    });

    this.el.nativeElement.innerHTML = "";
    this.el.nativeElement.appendChild(this.select);

    this._listener = this.renderer.listen(this.select, "change", this.onChange.bind(this));
    this._active = true;
  }

  @Input() paginatorDots: number[];
  @Input() onSelectPage: (page: number) => void;

  public select: HTMLSelectElement;

  private _active: boolean = false;
  private _listener: () => void;
  private readonly _defaultValue: string = "-";

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.select = this.renderer.createElement("select");
  }

  /**
   * Handler for select option
   *
   * @param {any} { currentTarget }
   * @memberof PaginatorDirective
   */
  public onChange({ currentTarget }): void {
    this.onSelectPage(+currentTarget.value);

    this._active = false;
    this.el.nativeElement.innerHTML = "...";
    this._listener();
  }

  /**
   * Create option for select
   *
   * @private
   * @param {string} value
   * @returns {HTMLOptionElement}
   * @memberof PaginatorDirective
   */
  private _createOption(value: string): HTMLOptionElement {
    let option: HTMLOptionElement = this.renderer.createElement("option");

    option.value = value;
    option.innerHTML = value;

    return option;
  }
}
