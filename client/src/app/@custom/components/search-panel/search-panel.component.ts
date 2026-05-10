import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
  forwardRef
} from "@angular/core";
import { filter, debounceTime, switchMap, tap, catchError, map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { InputSize } from "../input/models/input-size";

@Component({
  selector: "custom-search-panel",
  templateUrl: "./search-panel.component.html",
  styleUrls: ["./search-panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchPanelComponent),
      multi: true
    }
  ],
  standalone: false
})
export class SearchPanelComponent implements OnInit, ControlValueAccessor {
  @Output() searchClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() resultEnter: EventEmitter<any> = new EventEmitter<any>();
  @Output() resultUpdate: EventEmitter<any> = new EventEmitter<any>();

  @Output() clearValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() focusEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() blurEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() resultClick: EventEmitter<void> = new EventEmitter<void>();

  @Input() role = "text";
  @Input() size: InputSize;
  @Input() autoFocus: boolean;
  @Input() placeholder = "";
  @Input() label: string;
  @Input() min: number = null;
  @Input() max: number = null;
  @Input() width: number;
  @Input() error: string;
  @Input() loading: boolean;
  @Input() disabled: boolean;
  @Input() fieldName: string;
  @Input() showClear = true;
  @Input() showSearchIcon = true;
  @Input() maxHeightModal: number = 400;
  @Input() maxLength: number;

  @Input() minLengthResult = 1;
  @Input() resultFn: (s: string) => Observable<any[]>;
  @Input() resultDisplayField: string;
  @Input() resultTemplate: TemplateRef<any>;
  @Input() debounceTime = 1000;
  @Input() inlineSearch: boolean;
  @Input() theme: "outlined" | "filled" | "underlined" = "outlined";
  @Input() resultInValue: boolean;
  @Input() clearOnlyValue: boolean;

  @Input() result: any[];
  @Input() isOpenResult: boolean;
  public resultIndexFocused = null;
  public isFocus: boolean;

  private _isSearchValidValue: boolean;

  @Input()
  get value() {
    return this._value;
  }
  set value(data) {
    this._value = data;
    this.valueChange.emit(this._value);
    this.onChange(data);
  }

  private _value: any = null;
  private _inputResult$: Subject<string>;

  constructor(
    public elementRef: ElementRef,
    private _renderer: Renderer2,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._initializeInputResult();

    if (this.width) {
      this._renderer.setStyle(this.elementRef.nativeElement, "width", `${this.width}px`);
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

  public onFocus(): void {
    this.onTouched();
    this.isFocus = true;
    this.focusEvent.emit();
  }

  public onBlur(): void {
    this.isFocus = false;
    this.blurEvent.emit();
  }

  public onClick(): void {
    this.searchClick.emit(this);
  }

  public onClickClear(): void {
    this.clearSearch();
  }

  public clearSearch(): void {
    this.loading = false;
    this.focusEvent.emit();

    if (this.resultFn && this.minLengthResult === 0) {
      this.value = "";
      this._inputResult$.next("");
      return;
    }

    this.value = null;
    this.clearValue.emit(this);
    if (this.clearOnlyValue) {
      return;
    }
    this.result = null;
    this.resultUpdate.emit(this.result);
    this._resetResult();
  }

  public onValueChange(value: any): void {
    if (typeof value === "string" && this.resultFn) {
      this._inputResult$.next(value);
    }
    if (!value && this.value !== value) {
      this.clearSearch();
    }
  }

  public onEnterClick(): void {
    this.blurEvent.emit();

    if (this.result && this.resultIndexFocused !== null) {
      this.resultEnter.emit(this.result[this.resultIndexFocused]);
      this.resultIndexFocused = null;
      return;
    }

    this.enterClick.emit(this);
  }

  public onSearchClick(): void {
    this.searchClick.emit(this);
  }

  public onInputClick(): void {
    this.resultIndexFocused = null;
  }

  public onResultDown(e: KeyboardEvent): void {
    e.preventDefault();

    if (!this.result) {
      return;
    }

    if (this.resultIndexFocused === null) {
      this.resultIndexFocused = 0;
      return;
    }

    this.resultIndexFocused = this.resultIndexFocused + 1 < this.result.length ? this.resultIndexFocused + 1 : 0;
  }

  public onResultUp(e: KeyboardEvent): void {
    e.preventDefault();

    if (!this.result) {
      return;
    }

    if (this.resultIndexFocused === null) {
      this.resultIndexFocused = 0;
      return;
    }

    this.resultIndexFocused = this.resultIndexFocused - 1 >= 0 ? this.resultIndexFocused - 1 : this.result.length - 1;
  }

  public onClickResult(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
  }

  public onSelectResult(item: any): void {
    this.blurEvent.emit();
    this.resultClick.emit(item);
    this.resultIndexFocused = null;
    if (this.resultInValue) {
      this.value = item[this.resultDisplayField];
    }
  }

  private _initializeInputResult(): void {
    if (!this.resultFn) {
      return;
    }

    this._inputResult$ = new Subject<string>();
    this._inputResult$
      .pipe(
        tap(() => this._resetResult()),
        filter((i: any) => (this._isSearchValidValue = i.length >= this.minLengthResult)),
        tap(() => {
          if (this.debounceTime) {
            this.loading = true;
            this._setResult([]);
            this.resultUpdate.emit(this.result);
          }

          this.isOpenResult = true;
        }),
        debounceTime(this.debounceTime),
        filter((str) => {
          if (!this._isSearchValidValue) {
            return false;
          }
          return (str && this.inlineSearch) || this.isOpenResult;
        }),
        switchMap((s) => this.resultFn(s)),
        catchError((err, r) => {
          this.clearSearch();
          return r;
        })
      )
      .subscribe((result) => {
        this._setResult(result);
        this.resultUpdate.emit(result);
        this.loading = false;
        this._cdRef.detectChanges();
      });
  }

  private _setResult(result: any[]): void {
    if (!this.clearOnlyValue) {
      this.result = result;
    }
  }

  private _resetResult(): void {
    this.loading = false;
    this.isOpenResult = false;
  }
}
