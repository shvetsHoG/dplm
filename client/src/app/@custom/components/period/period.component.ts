import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
  Injector,
  forwardRef
} from "@angular/core";
import { OverlayComponent } from "@custom/common/components/overlay/overlay.component";
import { PeriodDropdownComponent } from "./period-dropdown/period-dropdown.component";
import { takeUntil } from "rxjs/operators";
import { OverlayService } from "@custom/common/services/overlay.service";
import { Subject } from "rxjs";
import { PeriodSize } from "./models/period-size";
import { CalendarPeriodDirection } from "../calendar/models/calendar-period";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "custom-period",
  templateUrl: "./period.component.html",
  styleUrls: ["./period.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PeriodComponent),
      multi: true
    }
  ],
  standalone: false
})
export class PeriodComponent implements OnInit, ControlValueAccessor, OnDestroy {
  public readonly PeriodSize = PeriodSize;
  public readonly PeriodDirection = CalendarPeriodDirection;

  private readonly DATE_FORMAT = "DD MMM YYYY";
  private readonly DATE_FORMAT_WITH_TIME = "DD MMM YYYY, hh:mm";

  @ViewChild("periodEl", { static: true }) periodEl: ElementRef;

  @Input() withTime: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() step = 60;
  @Input() size: string;
  @Input() label: string;
  @Input() width: string;
  @Input() formatDate: string;
  @Input() showClear: boolean;

  @Input() disabledFrom: Date;
  @Input() disabledTo: Date;

  @Output() valueChange = new EventEmitter<any[]>(); //[Date, Date]

  public stepHour: number;
  public stepMinute: number;
  public stepSecond: number;
  public selectedDirection: CalendarPeriodDirection = null;

  private _value: any = [null, null];
  @Input() get value(): any[] {
    return this._value;
  }
  set value(val: any[]) {
    if (val === this._value) {
      return;
    }

    this._value = val;
    this.onChange(val);
  }

  public overlay: OverlayComponent<PeriodDropdownComponent>;
  public format: string = this.DATE_FORMAT;

  private _destroy$ = new Subject<void>();

  constructor(
    private _overlayService: OverlayService,
    private _cdRef: ChangeDetectorRef,
    private _injector: Injector
  ) {}

  ngOnInit() {
    if (this.formatDate) {
      this.format = this.formatDate;
    }

    if (this.withTime) {
      this.format = this.DATE_FORMAT_WITH_TIME;
    }

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
    this._cdRef.detectChanges();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public onSelectDirection(e: CalendarPeriodDirection): void {
    this.selectedDirection = e;
  }

  public onClick(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    if (this.overlay) {
      return;
    }

    if (!this.selectedDirection) {
      this.selectedDirection = CalendarPeriodDirection.start;
    }

    const [lastFrom, lastTo] = this.value;
    this.overlay = this._overlayService.open(PeriodDropdownComponent, this.periodEl, this._injector);
    this.overlay.overflowY = "hidden";
    this.overlay.contentReady.pipe(takeUntil(this._destroy$)).subscribe((instance: PeriodDropdownComponent) => {
      instance.instance = this;
      instance.value = this.value;
      instance.disabledFrom = this.disabledFrom;
      instance.disabledTo = this.disabledTo;
    });

    this.overlay.clickOverlay.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.selectedDirection = null;
      this.overlay = null;

      if (!this.withTime) {
        this._cdRef.detectChanges();
      }

      const val = this.value;

      if (lastFrom?.getTime() === val[0]?.getTime() && lastTo?.getTime() === val[1]?.getTime()) {
        return;
      }

      this.onTouched();
      this.valueChange.emit(val);
    });
  }

  public onClear(e?: MouseEvent): void {
    e?.stopPropagation();
    this.value = [];
    this.selectedDirection = CalendarPeriodDirection.start;
    this.valueChange.emit(this.value);
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
}
