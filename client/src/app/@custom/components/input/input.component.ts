import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { InputSize } from "./models/input-size";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "custom-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class InputComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy, AfterViewInit {
  public readonly InputSize = InputSize;

  @ViewChild("input", { static: true }) input: ElementRef<HTMLInputElement>;
  @ViewChild("buffer", { static: true }) buffer: ElementRef;

  @Output() focusEvent: EventEmitter<Event> = new EventEmitter();
  @Output() blurEvent: EventEmitter<Event> = new EventEmitter();

  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() iconClick: EventEmitter<void> = new EventEmitter();
  @Output() enterKey: EventEmitter<string> = new EventEmitter();
  @Output() inputClick: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() clearValue: EventEmitter<void> = new EventEmitter();

  @Output() arrowDown: EventEmitter<KeyboardEvent> = new EventEmitter();
  @Output() arrowUp: EventEmitter<KeyboardEvent> = new EventEmitter();

  @Input() size: InputSize;
  @Input() role: string = "text";
  @Input() minWidth: number;
  @Input() autoWidth: boolean;
  @Input() step: number;
  @Input() pattern: string;
  @Input() placeholder: string = "";
  @Input() autocomplete: boolean;
  @Input() width: number;
  @Input() height: number;
  @Input() pure: boolean = false;
  @Input() max: number = null;
  @Input() min: number = null;
  @Input() disabled: boolean;
  @Input() autoFocus: boolean;
  @Input() icon: string;
  @Input() iconClassName: string;
  @Input() focusEmitter: EventEmitter<void>;
  @Input() blurEmitter: EventEmitter<void>;
  @Input() autoSelection: boolean;
  @Input() focusClass: boolean;
  @Input() readonly: boolean = false;
  @Input() theme: "outlined" | "filled" | "underlined" = "outlined";
  @Input() paddingRight: number = 0;
  @Input() maxLength: number;
  @Input() loading: boolean;
  @Input() showClear: boolean;
  @Input() showSearchIcon: boolean;
  @Input() isKeyupEvent: boolean;
  @Input() timeOut: number;
  @Input() label: string;
  @Input() withoutText: boolean;
  @Input() isDateReadonly: boolean;
  @Input() borderStyle: "default" | "new" = "default";
  @Input() errorText: string;

  public padding: number;
  public isInvalid = false;
  public errorMaxWidth: number;

  private _observer: MutationObserver;
  private _destroy$ = new Subject<void>();
  private _inputResult$ = new Subject<string>();

  private _value: any = null;
  @Input() set value(val: any) {
    if (val === undefined) {
      val = null;
    }

    if (val && this.withoutText) {
      val.replace(/[A-Za-zА-Яа-яЁё]/, "");
    }

    if (this._value === val) {
      return;
    }

    this._value = val;

    if (this.timeOut > 0) {
      this._inputResult$.next(val);
    } else {
      this.valueChange.emit(val);
    }

    this.onChange(val);
  }

  get value(): any {
    return this._value;
  }

  public isFocused: boolean;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _translate: TranslateService,
    private _elementRef: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ("readonly" in changes && this.autoWidth) {
      setTimeout(() => {
        this._calcPadding();
        this._cdRef.detectChanges();
      });
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

  ngOnInit() {
    this._observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const element = this._elementRef.nativeElement;
          this.isInvalid = element.classList.contains("ng-invalid") && element.classList.contains("ng-dirty");
        }
      });
    });

    this._observer.observe(this._elementRef.nativeElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (this.placeholder) {
      this.placeholder = this._translate.instant(this.placeholder);
    }
    if (this.autoFocus) {
      this.setFocus();
    }

    if (this.focusEmitter) {
      this.focusEmitter.pipe(takeUntil(this._destroy$)).subscribe(this.setFocus.bind(this));
    }

    if (this.blurEmitter) {
      this.blurEmitter.pipe(takeUntil(this._destroy$)).subscribe(this.setBlur.bind(this));
    }

    if (this.autoWidth) {
      this._calcPadding();
    }

    if (this.timeOut > 0) {
      this._initializeInputResult();
    }
  }

  ngAfterViewInit() {
    this.errorMaxWidth = this.input.nativeElement.offsetWidth;
  }

  ngOnDestroy() {
    if (this._observer) {
      this._observer.disconnect();
    }

    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public setBlur(): void {
    this.input.nativeElement.blur();
  }

  public onClickIcon(): void {
    this.iconClick.emit();
  }

  public onClear(e?: MouseEvent): void {
    e?.stopPropagation();
    this.value = null;
    this.clearValue.emit();
  }

  public onClick(e: MouseEvent): void {
    this.inputClick.emit(e);
  }

  public onFocus(e: Event): void {
    this.isFocused = true;
    this.focusEvent.emit(e);
    if (this.autoSelection) {
      (this.input.nativeElement as HTMLInputElement).select();
    }
  }

  public onBlur(e: Event): void {
    this.isFocused = false;
    this.blurEvent.emit(e);
  }

  public preventE(event) {
    if (this.role === "number" && event.which === 101) {
      event.preventDefault();
    }
  }

  public onChangeValue(e: Event): void {
    this.onTouched();
    if (this.role === "number") {
      if (this.min !== null && this.value < this.min) {
        (e.target as HTMLInputElement).value = this.min.toString();
      }
      if (this.max !== null && this.value > this.max) {
        (e.target as HTMLInputElement).value = this.max.toString();
      }
    }
    this.value = (e.target as HTMLInputElement).value;
  }

  public onKeyup(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (this.isKeyupEvent) {
      this.onTouched();
      this.value = value;
    }
  }

  public onEnter(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.enterKey.emit(this.value);
    this.setBlur();
  }

  public onInput(e: Event): void {
    this.onTouched();
    const target = e.target as HTMLInputElement;
    if (this.role === "number") {
      if (this.min !== null && +target.value < this.min) {
        target.value = this.min.toString();
      }
      if (this.max !== null && +target.value > this.max) {
        target.value = this.max.toString();
      }
      if (this.maxLength !== null && +target.value > this.maxLength) {
        target.value = target.value.slice(0, this.maxLength);
      }
    }
    this.value = target.value;
  }

  public onPaste(e: ClipboardEvent): void {
    this.onTouched();
    // this.value = e.clipboardData.getData('text/plain');
  }

  public onArrowDown(e: KeyboardEvent): void {
    this.arrowDown.emit(e);
  }

  public onArrowUp(e: KeyboardEvent): void {
    this.arrowUp.emit(e);
  }

  private _calcPadding(): void {
    const padding = Number.parseInt(window.getComputedStyle(this.input.nativeElement).paddingLeft, 10);
    this.padding = padding * 4 + 2;
  }

  private _initializeInputResult(): void {
    this._inputResult$.pipe(debounceTime(this.timeOut), takeUntil(this._destroy$)).subscribe((result) => {
      this.valueChange.emit(result);
    });
  }
}
