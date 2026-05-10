import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  forwardRef,
  OnDestroy
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { InputSize } from "../input/models/input-size";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "custom-textarea",
  templateUrl: "./textarea.component.html",
  styleUrls: ["./textarea.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TextareaComponent implements OnInit, ControlValueAccessor, OnDestroy {
  public readonly InputSize = InputSize;

  @ViewChild("textarea", { static: true }) textarea: ElementRef<HTMLTextAreaElement>;

  @Output() focusEvent: EventEmitter<Event> = new EventEmitter();
  @Output() blurEvent: EventEmitter<Event> = new EventEmitter();

  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() ctrlEnter: EventEmitter<string> = new EventEmitter<string>();
  @Output() shiftEnter: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSelectText: EventEmitter<{ start: number; end: number; text: string }> = new EventEmitter<{
    start: number;
    end: number;
    text: string;
  }>();

  @Input() placeholder = "";
  @Input() autocomplete: boolean;
  @Input() height: string;
  @Input() disabled: boolean;
  @Input() autoFocus: boolean;
  @Input() icon: string;
  @Input() focusEmitter: EventEmitter<void>;
  @Input() blurEmitter: EventEmitter<void>;
  @Input() autoResizeEnabled: boolean;
  @Input() maxHeight: string;
  @Input() minHeight: string;
  @Input() pure: boolean;
  @Input() rows: number = null;
  @Input() readonly = false;
  @Input() size: InputSize;
  @Input() maxLength: number;
  @Input() label: string;
  @Input() resizeVertical: boolean;

  private _value: any = "";
  @Input() set value(val: any) {
    if (val === undefined) {
      val = null;
    }

    if (this._value === val) {
      return;
    }

    this._value = val;
    if (this.autoResizeEnabled) {
      this._calculateHeight();
    }

    this.onChange(val);
    this.valueChange.emit(val);
  }
  get value(): any {
    return this._value;
  }

  public isFocused: boolean;
  private _destroy$ = new Subject<void>();

  constructor(private _cdRef: ChangeDetectorRef) {}

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
    this._cdRef.detectChanges();
    if (this.autoResizeEnabled) {
      this._calculateHeight();
    }
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
    if (this.autoFocus) {
      this.setFocus();
    }

    if (this.focusEmitter) {
      this.focusEmitter.pipe(takeUntil(this._destroy$)).subscribe(this.setFocus.bind(this));
    }

    if (this.blurEmitter) {
      this.blurEmitter.pipe(takeUntil(this._destroy$)).subscribe(this.setBlur.bind(this));
    }

    this.textarea.nativeElement.addEventListener("blur", () => {
      const selectionStart = this.textarea.nativeElement.selectionStart;
      const selectionEnd = this.textarea.nativeElement.selectionEnd;
      const text = document.getSelection()?.toString();
      this.onSelectText.emit({ start: selectionStart, end: selectionEnd, text: text });
    });
  }

  ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public reculc(): void {
    this._calculateHeight();
  }

  public setFocus(pos?: number, posEnd?: number): void {
    this.textarea.nativeElement.focus();

    if (pos) {
      this.textarea.nativeElement.setSelectionRange(pos, posEnd ? posEnd : pos);
    }
  }

  public setBlur(): void {
    this.textarea.nativeElement.blur();
  }

  public onFocus(e: Event): void {
    this.isFocused = true;
    this.focusEvent.emit(e);
  }

  public onBlur(e: Event): void {
    this.isFocused = false;
    this.blurEvent.emit(e);
  }

  public onChangeValue(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  public onKeyup(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  public onCtrlEnter(e: KeyboardEvent): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
    this.ctrlEnter.emit(this.value);
  }

  public onShiftEnter(e: KeyboardEvent): void {
    e.preventDefault();

    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
    this.shiftEnter.emit(this.value);
  }

  public onInput(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  public onPaste(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  private _calculateHeight(): void {
    if (!this.textarea) {
      return;
    }

    const el = this.textarea.nativeElement as HTMLTextAreaElement;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 2 + "px";
  }
}
