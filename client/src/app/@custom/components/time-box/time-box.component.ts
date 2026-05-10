import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  Input,
  EventEmitter,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Injector
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { OverlayComponent } from "@custom/common/components/overlay/overlay.component";
import { TimeBoxOverlayComponent } from "./time-box-overlay/time-box-overlay.component";
import { OverlayService } from "@custom/common/services/overlay.service";
import { InputComponent } from "../input/input.component";
import { InputSize } from "../input/models/input-size";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "custom-time-box",
  templateUrl: "./time-box.component.html",
  styleUrls: ["./time-box.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeBoxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TimeBoxComponent implements OnInit, OnDestroy {
  @ViewChild("timeBox", { static: true }) timeBox: ElementRef;
  @ViewChild("input", { static: true }) input: InputComponent;

  @Output() valueChange: EventEmitter<Date> = new EventEmitter();
  @Output() clearValue: EventEmitter<void> = new EventEmitter();
  @Output() enterKey: EventEmitter<Date> = new EventEmitter();

  @Input() size: InputSize;
  @Input() width: number;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() min: Date;
  @Input() max: Date;
  @Input() label: string;

  @Input() showClear: boolean;
  @Input() theme: "outlined" | "filled" | "underlined" = "outlined";

  @Input() step = 5;
  @Input() hideIcon: boolean;

  public inputValue: string;
  private _destroy$ = new Subject<void>();

  @Input() get value(): Date {
    return this.toDateValue(this.inputValue);
  }
  set value(val: Date) {
    const value = this.toStringValue(val);
    if (value && value === this.inputValue) {
      return;
    }

    this.inputValue = value;
    this.onChange(val);
    this._cdRef.detectChanges();
  }

  public stepHour: number;
  public stepMinute: number;
  public stepSecond: number;

  public overlay: OverlayComponent<TimeBoxOverlayComponent>;

  private _lastValue: Date;

  constructor(
    private _overlayService: OverlayService,
    private _cdRef: ChangeDetectorRef,
    private _injector: Injector
  ) {}

  ngOnInit() {
    this.stepHour = Math.floor(this.step / (60 * 60)) || 1;
    this.stepMinute = Math.floor(this.step / 60) || 1;
    this.stepSecond = this.step;
  }

  ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
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

  public onEnterKey(): void {
    if (this.overlay) {
      this.overlay.close();
      this._applyValue();
      this.enterKey.emit(this.value);
      this.input.setBlur();
    }
  }

  public onWheel(e: WheelEvent): void {
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
      return;
    }

    let subs: Subscription;
    this.overlay = this._overlayService.open(TimeBoxOverlayComponent, this.timeBox, this._injector);
    this.overlay.overflowY = "hidden";
    this.overlay.contentReady.pipe(takeUntil(this._destroy$)).subscribe((instance: TimeBoxOverlayComponent) => {
      instance.instance = this;
      instance.value = this.inputValue;
      subs = instance.valueChange.subscribe((val) => {
        this.value = val;
        this.valueChange.emit(val);
      });
    });

    this.overlay.clickOverlay.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.overlay = null;
      subs.unsubscribe();
      this._cdRef.detectChanges();
      this._applyValue();
    });
  }

  public onClear(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.value = null;
    this.clearValue.emit();
  }

  public onChangeValue(val: string): void {
    this.value = this.toDateValue(val);
    if (this.overlay) {
      this.overlay.componentRef?.instance?.setValue(val);
    }
  }

  public toStringValue(val: any): string {
    if (!val) {
      return null;
    }

    if (typeof val === "string" || typeof val === "number") {
      val = new Date(val);
    }

    let str = "";
    str += val.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
    if (this.step < 60 * 60) {
      str += ":" + val.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
    }
    if (this.step < 60) {
      str += ":" + val.getSeconds().toLocaleString(undefined, { minimumIntegerDigits: 2 });
    }

    return str;
  }

  public toDateValue(val: string): Date {
    if (!val) {
      return;
    }

    const date = new Date().withoutTime();
    const units = val.split(":");

    if (units[0]) {
      date.setHours(+units[0]);
    }
    if (units[1]) {
      date.setMinutes(+units[1]);
    }
    if (units[2]) {
      date.setSeconds(+units[2]);
    }

    return date;
  }

  private _applyValue(): void {
    const val = this.value;
    if (!this._lastValue || (val && val.getTime() !== this._lastValue.getTime()) || (this._lastValue && !val)) {
      this.valueChange.emit(val);
      this._lastValue = val;
    }
  }
}
