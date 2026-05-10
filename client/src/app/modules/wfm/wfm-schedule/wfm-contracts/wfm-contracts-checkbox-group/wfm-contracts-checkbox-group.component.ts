import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { WfmWeekDay } from "app/models/wfm/wfm-dict";
import { WeekDayType } from "app/models/wfm/wfm";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "app-wfm-contracts-checkbox-group",
    templateUrl: "./wfm-contracts-checkbox-group.component.html",
    styleUrls: ["./wfm-contracts-checkbox-group.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WfmContractsCheckboxGroupComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class WfmContractsCheckboxGroupComponent implements ControlValueAccessor {
  @Input() isNotValid = false;

  @Input() set value(val: WfmWeekDay[]) {
    if (val !== this._value) {
      this.valueChange.emit(val);
      this._value = val;
      this.onChange(val);
    }
  }

  get value(): WfmWeekDay[] {
    return this._value;
  }

  private _value: WfmWeekDay[];

  @Output() valueChange: EventEmitter<WfmWeekDay[]> = new EventEmitter();

  readonly weekDayType = WeekDayType;

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: WfmWeekDay[]) {
    this.value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public onWeekdayChange(weekDay: WfmWeekDay) {
    if (weekDay) {
      let newDays: WfmWeekDay[] = [];

      for (let i = 0; i < 7; i++) {
        const day = this.value[(weekDay.number + i) % 7];

        if (i < 5) {
          newDays.push({ ...day, type: WeekDayType.WORKDAY });
        } else {
          newDays.push({ ...day, type: WeekDayType.WEEKEND });
        }
      }

      newDays = newDays.sort((a, b) => a.number - b.number);

      this.writeValue(newDays);

      this.valueChange.emit(this.value);
      this.onChange(this.value);
    }
  }
}
