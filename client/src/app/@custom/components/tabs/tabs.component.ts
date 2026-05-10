import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  forwardRef,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
    selector: "custom-tabs",
    templateUrl: "./tabs.component.html",
    styleUrls: ["./tabs.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TabsComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TabsComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Input() dataSource: any[];
  @Input() initialValue = false;
  @Input() displayExpr = "name";
  @Input() disabled: boolean;
  @Input() className = "tabs-default";
  @Input() tabTemplate: TemplateRef<any>;
  @Input() isFlex: boolean;

  private _value: any;
  @Input() get value(): any {
    return this._value;
  }
  set value(val: any) {
    if (!this.dataSource) {
      return;
    }

    if (val === this._value) {
      return;
    }

    this.valueChange.emit(val);
    this.onChange(val);
    this._value = val;
  }

  constructor(private _cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ("dataSource" in changes && this.dataSource) {
      if (this.initialValue) {
        this.value = this.dataSource[0];
      }
    }
  }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any) {
    if (!this.dataSource) {
      return;
    }

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
  }

  public onClick(tab: any): void {
    this.value = tab;
  }
}
