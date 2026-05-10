import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { CalendarMode } from "./models/calendar-mode";
import { DateFormatPipe } from "@custom/common/pipes/data-format.pipe";
import { CalendarPeriodDirection } from "./models/calendar-period";

@Component({
  selector: "custom-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CalendarComponent implements OnInit {
  public readonly CalendarMode = CalendarMode;
  public readonly CalendarPeriodDirection = CalendarPeriodDirection;

  @Output() valueChange: EventEmitter<Date> = new EventEmitter();
  @Output() valueEndChange: EventEmitter<Date> = new EventEmitter();
  @Output() periodDirectionChange: EventEmitter<CalendarPeriodDirection> = new EventEmitter();
  @Output() changeSlide: EventEmitter<Date> = new EventEmitter();

  public selectedDate: Date;
  public dates: Date[];
  public years: number[];
  public months: string[] = [];
  public days: string[] = [];

  public hoverDate: Date;

  @Input() startDisabledDate: Date;

  @Input() disabledFrom: Date;
  @Input() disabledTo: Date;

  @Input() current = new Date();
  public selectedPeriodDate: Date;
  public firstDate: Date;
  public lastDate: Date;
  public now: Date;
  public mode: CalendarMode = CalendarMode.Numbers;

  @Input() startMode: CalendarMode;

  @Input() arrayValuesDay: { [key: string]: number } = {};

  private _value: Date;
  @Input()
  get value(): Date {
    return this._value;
  }
  set value(val: Date) {
    if (this._value === val) {
      return;
    }

    if ((typeof val === "string" || typeof val === "number") && val) {
      val = new Date(val);
    }

    this._value = val ? val.withoutTime() : null;
    this.valueChange.emit(val);
  }

  @Input() isPeriod: boolean;

  private _periodDirection: CalendarPeriodDirection = CalendarPeriodDirection.start;
  @Input() set periodDirection(val: CalendarPeriodDirection) {
    if (val !== null && this.value && this._valueEnd) {
      this.current = val === CalendarPeriodDirection.start ? this.value : this._valueEnd;
      this._renderNumbers(this.current);
    }

    this._periodDirection = val;
  }
  get periodDirection(): CalendarPeriodDirection {
    return this._periodDirection;
  }

  private _valueEnd: Date;
  @Input()
  get valueEnd(): Date {
    return this._valueEnd;
  }
  set valueEnd(val: Date) {
    if (this._valueEnd === val) {
      return;
    }

    this._valueEnd = val ? val.withoutTime() : null;
    this.valueEndChange.emit(val);
  }

  constructor(private _dateFormatPipe: DateFormatPipe) {
    this.now = new Date();
    this.now.setHours(0, 0, 0, 0);

    for (let i = 0; i < 12; i++) {
      this.months.push(this._dateFormatPipe.transform(new Date(2000, i), "MMM"));
    }
    for (let i = 0; i < 7; i++) {
      this.days.push(this._dateFormatPipe.transform(new Date(2021, 1, i + 1, 12), "d"));
    }
  }

  ngOnInit() {
    if (!this.current) {
      this.current = new Date();
    }

    if (this.value) {
      this.current = this.value;
    }

    if (this.isPeriod && this.value && this._valueEnd) {
      this.current = this.periodDirection === CalendarPeriodDirection.start ? this.value : this._valueEnd;
    }

    this._renderNumbers(this.current);
  }

  public onClickToday(): void {
    this.current = new Date();
    this._renderNumbers(this.current);
    this.onClick(this.now);
  }

  public onHover(date: Date): void {
    this.hoverDate = date;
  }

  public onPrev(): void {
    switch (this.mode) {
      case CalendarMode.Numbers:
        this.current = new Date(this.current.getFullYear(), this.current.getMonth() - 1, 1);
        this.changeSlide.emit(this.current);
        this._renderNumbers(this.current);
        return;
      case CalendarMode.Months:
        this.current = new Date(this.current.getFullYear() - 1, this.current.getMonth(), 1);
        this.changeSlide.emit(this.current);
        this._renderNumbers(this.current);
        return;
      case CalendarMode.Years:
        this.current = new Date(this.current.getFullYear() - 9, this.current.getMonth(), 1);
        this.changeSlide.emit(this.current);
        this._renderYears(this.current.getFullYear());
        return;
    }
  }

  public onNext(): void {
    switch (this.mode) {
      case CalendarMode.Numbers:
        this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
        this.changeSlide.emit(this.current);
        this._renderNumbers(this.current);
        return;
      case CalendarMode.Months:
        this.current = new Date(this.current.getFullYear() + 1, this.current.getMonth(), 1);
        this.changeSlide.emit(this.current);
        this._renderYears(this.current.getFullYear());
        return;
      case CalendarMode.Years:
        this.current = new Date(this.current.getFullYear() + 9, this.current.getMonth(), 1);
        this.changeSlide.emit(this.current);
        this._renderYears(this.current.getFullYear());
        return;
    }
  }

  public onClick(date: Date): void {
    if (this.startDisabledDate && date > this.startDisabledDate) {
      return;
    }
    if (this.disabledTo && date < this.disabledTo) {
      return;
    }
    if (this.disabledFrom && date > this.disabledFrom) {
      return;
    }
    if (this.isPeriod) {
      if (this.periodDirection === CalendarPeriodDirection.end) {
        if (date.getTime() < this.value?.getTime()) {
          return;
        }

        this.valueEnd = date;
        if (!this.value) {
          this.periodDirection = CalendarPeriodDirection.start;
        }
      } else if (this.periodDirection === CalendarPeriodDirection.start) {
        if (date.getTime() > this.valueEnd?.getTime()) {
          return;
        }

        this.value = date;
        if (!this.valueEnd) {
          this.periodDirection = CalendarPeriodDirection.end;
        }
      }
      this.periodDirectionChange.emit(this.periodDirection);
    } else {
      this.value = date;
    }

    if (date.getTime() < this.firstDate.getTime()) {
      this.onPrev();
      return;
    }
    if (date.getTime() > this.lastDate.getTime()) {
      this.onNext();
      return;
    }
  }

  public onClickYear(year: number): void {
    this.current = new Date(year, this.current.getMonth(), 1);

    if (this.disabledTo && year < this.disabledTo.getFullYear()) {
      return;
    }

    if (this.startMode === CalendarMode.Years) {
      this.value = this.current;
      return;
    }
    this.switchMode(CalendarMode.Months);
  }

  public onClickMonth(month: number): void {
    this.current = new Date(this.current.getFullYear(), month, 1);

    if (
      this.disabledTo &&
      month < this.disabledTo.getMonth() &&
      this.current.getFullYear() <= this.disabledTo.getFullYear()
    ) {
      return;
    }

    if (this.startMode === CalendarMode.Months) {
      this.value = this.current;
      return;
    }
    this.switchMode(CalendarMode.Numbers);
  }

  public switchMode(mode: CalendarMode): void {
    this.mode = mode === this.mode ? CalendarMode.Numbers : mode;

    switch (mode) {
      case CalendarMode.Numbers:
        this._renderNumbers(this.current);
        return;
      case CalendarMode.Years:
        this._renderYears(this.current.getFullYear());
        return;
    }
  }

  private _renderNumbers(current: Date): void {
    this.firstDate = new Date(current.getFullYear(), current.getMonth(), 1);
    this.lastDate = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    this.dates = [];

    const firstDay = this._getDay(this.firstDate.getDay());
    const lastDay = this._getDay(this.lastDate.getDay());
    if (firstDay > 0) {
      for (let i = firstDay - 1; i >= 0; i--) {
        this.dates.push(new Date(this.firstDate.getFullYear(), this.firstDate.getMonth(), -i));
      }
    }

    for (let i = 1; i < this.lastDate.getDate() + 1; i++) {
      this.dates.push(new Date(current.getFullYear(), current.getMonth(), i));
    }

    if (lastDay < 6) {
      for (let i = 1; i <= 6 - lastDay; i++) {
        this.dates.push(new Date(this.firstDate.getFullYear(), this.firstDate.getMonth() + 1, i));
      }
    }

    this._addWeek();
  }

  private _renderYears(year: number): void {
    this.years = [];
    for (let i = year - 4; i <= year + 4; i++) {
      this.years.push(i);
    }
  }

  private _getDay(day: number) {
    if (day === 0) {
      return 6;
    }

    return day - 1;
  }

  private _addWeek(): void {
    if (Math.ceil(this.dates.length / 7) < 6) {
      const last = this.dates[this.dates.length - 1];
      for (let i = 1; i <= 7; i++) {
        this.dates.push(
          new Date(
            this.lastDate.getFullYear(),
            this.lastDate.getMonth() + 1,
            last.getDate() === this.lastDate.getDate() ? i : last.getDate() + i
          )
        );
      }
      this._addWeek();
    }
  }
}
