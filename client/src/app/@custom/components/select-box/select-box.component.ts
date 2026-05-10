import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
  Injector
} from "@angular/core";

import { SelectBoxOverlayComponent } from "./select-box-overlay/select-box-overlay.component";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { OverlayComponent } from "@custom/common/components/overlay/overlay.component";
import { OverlayService } from "@custom/common/services/overlay.service";
import { Observable, Subject } from "rxjs";
import { SelectBoxSize } from "./models/select-box-size";
import { takeUntil } from "rxjs/operators";
import { Tab } from "@core/models/tab/tab";

const SIZE_HEIGHT = {
  small: 28,
  middle: 34,
  large: 44
};

@Component({
  selector: "custom-select-box",
  templateUrl: "./select-box.component.html",
  styleUrls: ["./select-box.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SelectBoxComponent implements OnInit, ControlValueAccessor, OnDestroy {
  public readonly SelectBoxSize = SelectBoxSize;

  @ViewChild("selectBox", { static: true }) selectBox: ElementRef;
  @ViewChild("selectRef", { static: true }) selectRef: ElementRef;
  @ViewChild("defaultItemTemplate", { static: true }) defaultItemTemplate: TemplateRef<any>;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() selectAddition: EventEmitter<any> = new EventEmitter();
  @Output() tabClick: EventEmitter<string> = new EventEmitter();

  @Input() dataSource: any[];
  @Input() additions: any[];
  @Input() displayExpr = "name";
  @Input() idExpr = "id";
  @Input() mode: "single" | "multi" = "single";
  @Input() placeholder: string;
  @Input() searchPlaceholder = "GENERAL.SEARCH_FOR_MEANING";
  @Input() searchEnable: boolean;
  @Input() showClear: boolean;
  @Input() size: SelectBoxSize;
  @Input() width: number;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() server: (val: string) => Observable<any[]>;
  @Input() customDisplayTemplate: TemplateRef<any>;
  @Input() customItemTemplate: TemplateRef<any>;
  @Input() customGroupTemplate: TemplateRef<any>;
  @Input() pure: boolean;
  @Input() grouping: boolean;
  @Input() optionPlaceholder: boolean;
  @Input() expanderIcon = "custom/custom-expander";
  @Input() label: string;
  @Input() tabs: Tab[];
  @Input() hasArchiveTabs: boolean;
  @Input() activeTab: Tab;
  @Input() onlyEventTab: boolean;
  @Input() componentStyle: "new" | "default" = "default";

  public selection: any = {};

  public itemTemplate: TemplateRef<any>;
  public displayTemplate: TemplateRef<any>;

  private _value: any | any[] = [];
  @Input() set value(val: any | any[]) {
    this.selection = {};

    if (this.mode === "multi") {
      (val ? val : (val = [])).forEach((i: any) => (this.selection[this.valueExpr(i)] = i));
    }

    if (val && this.mode === "single") {
      this.selection[this.valueExpr(val)] = val;
    }

    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
    this._cdRef.detectChanges();
  }
  get value(): any | any[] {
    return this._value;
  }

  public get isOpen(): boolean {
    return this.overlay !== null;
  }

  public get isEmpty(): boolean {
    return !this._value || this._value.length === 0;
  }

  public overlay: OverlayComponent<SelectBoxOverlayComponent> = null;

  private _selectElement: HTMLSelectElement;
  private _destroy$ = new Subject<void>();

  constructor(
    private _overlayService: OverlayService,
    private _cdRef: ChangeDetectorRef,
    private _injector: Injector
  ) {}

  ngOnInit() {
    this._selectElement = this.selectRef.nativeElement;
    // this.height = SIZE_HEIGHT[this.size];

    this.itemTemplate = this.customItemTemplate || this.defaultItemTemplate;
    this.displayTemplate = this.customDisplayTemplate || this.defaultItemTemplate;
  }

  ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();

    this._selectElement = null;
    if (this.overlay) {
      this.overlay.close();
      this.overlay = null;
    }
  }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
    this._cdRef.detectChanges();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdRef.detectChanges();
  }

  public onWheel(e: WheelEvent): void {
    if (!this.overlay) {
      return;
    }

    e.stopPropagation();
  }

  public onMouseDown(e: MouseEvent): void {
    if (!this.overlay) {
      return;
    }

    e.stopPropagation();
  }

  public onClick(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    if (this.overlay) {
      this.overlay.close();
      return;
    }

    this.overlay = this._overlayService.open(SelectBoxOverlayComponent, this.selectBox, this._injector);
    this.overlay.width = this.selectBox.nativeElement.offsetWidth;
    this.overlay.overflowY = "auto";
    this.overlay.contentReady.pipe(takeUntil(this._destroy$)).subscribe((instance: SelectBoxOverlayComponent) => {
      instance.instance = this;
      instance.dataSource = this.dataSource;
      instance.searchPlaceholder = this.searchPlaceholder;
      instance.server = this.server;
      instance.tabs = this.tabs;
      instance.activeTab = this.activeTab;
      instance.hasArchiveTabs = this.hasArchiveTabs;
      instance.onlyEventTab = this.onlyEventTab;

      instance.tabClick.pipe(takeUntil(this._destroy$)).subscribe((name: string) => this.tabClick.emit(name));
    });

    const subscr = this.overlay.clickOverlay.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.overlay = null;
      this._cdRef.detectChanges();
      subscr.unsubscribe();
    });
  }

  public onClear(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this._clear();
  }

  public onRemove(e: MouseEvent, item: any): void {
    e.stopPropagation();
    this.deselect(item);
  }

  public deselect(item: any): void {
    if (!Array.isArray(this.value)) {
      this.overlay.close();
      return;
    }

    this.value = this.value.filter((i: any) => (i[this.idExpr] || i) !== (item[this.idExpr] || item));
  }

  public select(item: any): void {
    if (this.mode === "single") {
      this.overlay.close();
      this.value = item;
      return;
    }

    this.value = [...this.value, item];
  }

  public onChangeValue(e: Event): void {
    const options = this._selectElement.options;
    if (this.mode === "multi") {
      const value = [];
      for (let i = 0; i < options.length && this._selectElement.selectedIndex > -1; i++) {
        if (options[i].selected) {
          value.push(this.dataSource[i]);
        }
      }
      this.value = value;
    }

    if (this.mode === "single") {
      if (this._selectElement.selectedIndex > -1) {
        this.value = this.dataSource[this._selectElement.selectedIndex];
      } else {
        this.value = null;
      }
    }

    if (this.overlay) {
      this.overlay.close();
    }
  }

  public valueExpr(item: any): any {
    return item ? (item[this.idExpr] !== undefined ? item[this.idExpr] : item) : null;
  }

  private _clear(): void {
    this.value = null;
  }
}
