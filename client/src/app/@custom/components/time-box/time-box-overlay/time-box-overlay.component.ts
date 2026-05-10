import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from "@angular/core";
import { TimeBoxType } from "../models/time-box-type";
import { TIME_BOX_UNIT } from "../models/time-box-unit";
import { InputSize } from "@custom/components/input/models/input-size";
import { CalendarPeriodDirection } from "@custom/components/calendar/models/calendar-period";

@Component({
  selector: "custom-time-box-overlay",
  templateUrl: "./time-box-overlay.component.html",
  styleUrls: ["./time-box-overlay.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TimeBoxOverlayComponent implements OnInit, OnDestroy {
  public readonly TimeBoxType = TimeBoxType;
  public readonly TIME_BOX_UNIT = TIME_BOX_UNIT;
  public readonly unitKeys = Object.keys(TIME_BOX_UNIT);
  public readonly InputSize = InputSize;

  @ViewChildren("elHours") elsHour: QueryList<ElementRef>;
  @ViewChildren("elMinutes") elsMinute: QueryList<ElementRef>;
  @ViewChildren("elSeconds") elsSecond: QueryList<ElementRef>;

  @Input() instance: any;

  private _value: string;
  @Input() set value(val: any) {
    if (val instanceof Date) {
      val = val.toLocaleTimeString();
      if (this._value === val || val.indexOf(this._value) > -1) {
        return;
      }
      this._setValue(val);
    }

    this._value = val;
  }
  get value(): any {
    return this._value;
  }

  @Output() valueChange = new EventEmitter();

  public itemsHour: number[] = [];
  public itemsMinute: number[] = [];
  public itemsSecond: number[] = [];

  public selectedHour: number = null;
  public selectedMinute: number = null;
  public selectedSecond: number = null;

  constructor(private _cdRef: ChangeDetectorRef) {}

  public toString = (val: number) => val.toLocaleString(undefined, { minimumIntegerDigits: 2 });

  ngOnInit() {
    this._generateItems();
    this._cdRef.detectChanges();
    this._setValue(this.value);
    this._cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.instance = null;
  }

  public onClick(e: MouseEvent, val: number, type: TimeBoxType) {
    // (e.target as HTMLDivElement).scrollIntoView({ behavior: 'smooth', block: 'start' }); //была проблема уменьшения высоты проекта, если не повторится, удалить
    this[`selected${type}`] = val;
    this._createValue(type);
  }

  public setValue(val: string): void {
    if (this.value === val) {
      return;
    }

    this.value = val;
    this._setValue(val);
    this._cdRef.detectChanges();
  }

  private _createValue(type: TimeBoxType): void {
    for (const unit of this.unitKeys) {
      if (this[`selected${unit}`] === null && this.instance.step < TIME_BOX_UNIT[unit].maxVal) {
        return;
      }
    }

    const date = new Date();
    date.setHours(this.selectedHour, this.selectedMinute, this.selectedSecond, 0);
    this.value = this.instance.toStringValue(date);
    this.valueChange.emit(date);

    if (
      type === TimeBoxType.Minute &&
      this.instance.step === 60 &&
      this.instance.selectedDirection === CalendarPeriodDirection.start
    ) {
      this.instance.selectedDirection = CalendarPeriodDirection.end;
    }
  }

  private _setValue(val: string): void {
    if (!val) {
      return;
    }

    const units = val.split(":");

    this.unitKeys.forEach((unit, index) => {
      if (!units[index]) {
        return;
      }

      this[`selected${unit}`] = +units[index];
      if (!this[`els${unit}`]) {
        return;
      }

      const el = this[`els${unit}`].toArray()[this[`items${unit}`].indexOf(this[`selected${unit}`])];

      if (!el) {
        return;
      }

      el.nativeElement.scrollIntoView();
    });
  }

  private _generateItems(): void {
    this.unitKeys.forEach((unit) => {
      if (this.instance[`step${unit}`] < TIME_BOX_UNIT[unit].maxVal) {
        this[`items${unit}`] = new Array(
          TIME_BOX_UNIT[unit].maxVal / this.instance[`step${unit}`] / TIME_BOX_UNIT[unit].minVal
        )
          .fill(null)
          .map((_, index) => index * this.instance[`step${unit}`]);
      }
    });
  }
}
