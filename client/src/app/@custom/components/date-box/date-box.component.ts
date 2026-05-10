import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { OverlayService } from "@custom/common/services/overlay.service";
import { CalendarComponent } from "../calendar/calendar.component";
import { OverlayComponent } from "@custom/common/components/overlay/overlay.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CalendarMode } from "../calendar/models/calendar-mode";
import { InputSize } from "../input/models/input-size";
import { TimeBoxComponent } from "../time-box/time-box.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";

@Component({
  selector: "custom-date-box",
  templateUrl: "./date-box.component.html",
  styleUrls: ["./date-box.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateBoxComponent),
      multi: true
    },
    DestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DateBoxComponent implements OnInit, ControlValueAccessor {
  @ViewChild("dateBox", { static: true }) dateBox: ElementRef;
  @ViewChild("timeBox") timeBox: TimeBoxComponent;

  @Output() valueChange: EventEmitter<Date> = new EventEmitter();
  @Output() clearValue: EventEmitter<void> = new EventEmitter();
  @Output() closeCalendar: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() openCalendar: EventEmitter<void> = new EventEmitter();

  @Input() size: InputSize;
  @Input() width: number;
  @Input() format = "D MMMM YYYY";
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() selectedPeriodDate: Date;
  @Input() min: Date;
  @Input() max: Date;
  @Input() plural = true;
  @Input() timeStep = 60;
  @Input() showClear: boolean;
  @Input() showIcon: boolean;
  @Input() withTime: boolean;
  @Input() mode: CalendarMode = CalendarMode.Numbers;
  @Input() current = new Date();
  @Input() theme: "outlined" | "filled" | "underlined" = "outlined";
  @Input() label: string;
  @Input() disabledTo: Date;
  @Input() disabledFrom: Date;
  @Input() disabletInput: boolean = true;

  private _value: Date = null;
  @Input() get value(): Date {
    return this._value;
  }

  set value(val: Date) {
    if (this._value === val) {
      return;
    }

    this._value = val;
    this.valueChange.emit(val);
    this.onChange(val);
  }

  public overlay: OverlayComponent<CalendarComponent>;

  constructor(
    private _overlayService: OverlayService,
    private _cdRef: ChangeDetectorRef,
    private _injector: Injector,
    private _destroy$: DestroyService
  ) {}

  ngOnInit() {}

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

  public onClick(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    if (this.overlay) {
      return;
    }

    this.overlay = this._overlayService.open(CalendarComponent, this.dateBox, this._injector);
    this.overlay.contentReady.pipe(takeUntil(this._destroy$)).subscribe((instance: CalendarComponent) => {
      instance.value = this.value;
      instance.startMode = this.mode;
      instance.mode = this.mode;
      instance.current = this.current;
      instance.disabledTo = this.disabledTo;
      instance.disabledFrom = this.disabledFrom;
      instance.selectedPeriodDate = this.selectedPeriodDate?.withoutTime();
      this.openCalendar.emit();
      instance.valueChange.pipe(takeUntil(this._destroy$)).subscribe((val) => {
        this.onTouched();
        this.value = val;
        this._cdRef.markForCheck();

        if (this.withTime) {
          this.timeBox.onClick();
        }
        this.overlay.close();
      });
    });

    this.overlay.clickOverlay.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.overlay = null;
      this._cdRef.detectChanges();
      this.closeCalendar.emit(this.value);
    });
  }

  public onClear(e?: MouseEvent): void {
    e?.stopPropagation();
    this.value = null;
    this.clearValue.emit();
  }

  public onChangeTime(e: Date): void {
    this.value = this.value ? this.value?.putTime(e) : e;
  }
}
