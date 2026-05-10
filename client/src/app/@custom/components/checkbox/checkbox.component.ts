import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
    selector: "custom-checkbox",
    templateUrl: "./checkbox.component.html",
    styleUrls: ["./checkbox.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

  @Input() disabled: boolean;
  @Input() label: string;
  @Input() isRadio: boolean;
  public uniq = `f${(~~(Math.random() * 1e8)).toString(16)}`;

  private _value = false;
  @Input() set value(val: boolean) {
    if (val === this._value) {
      return;
    }

    this.valueChange.emit(val);
    this._value = val;
    this.onChange(val);
  }
  get value(): boolean {
    return this._value;
  }

  constructor(private _cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: boolean) {
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

  public onChangeValue(e: MouseEvent): void {
    this.value = (e.target as HTMLInputElement).checked;
  }
}
