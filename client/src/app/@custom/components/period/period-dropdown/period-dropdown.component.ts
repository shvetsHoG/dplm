import { Component, OnInit, Input } from "@angular/core";
import { CalendarPeriodDirection } from "@custom/components/calendar/models/calendar-period";

@Component({
    selector: "custom-period-dropdown",
    templateUrl: "./period-dropdown.component.html",
    styleUrls: ["./period-dropdown.component.scss"],
    standalone: false
})
export class PeriodDropdownComponent implements OnInit {
  @Input() instance: any;
  @Input() value: any;

  @Input() disabledFrom: Date;
  @Input() disabledTo: Date;

  constructor() {}

  ngOnInit() {}

  public onChangeValueStart(e: Date): void {
    if (e && this.instance.value[0]) {
      e = e.putTime(this.instance.value[0]);
    }

    this.instance.value = [e, this.instance.value[1]];
  }

  public onChangeValueEnd(e: Date): void {
    if (e && this.instance.value[1]) {
      e = e.putTime(this.instance.value[1]);
    }

    this.instance.value = [this.instance.value[0], e];
  }

  public onChangePeriodDirection(e: CalendarPeriodDirection): void {
    this.instance.selectedDirection = e;
  }

  public onValueChange(e: Date): void {
    const val = this.instance.value;

    if (this.instance.selectedDirection === CalendarPeriodDirection.start) {
      this.instance.value = [(val[0] || new Date()).putTime(e), val[1]];
    } else if (this.instance.selectedDirection === CalendarPeriodDirection.end) {
      this.instance.value = [val[0], (val[1] || new Date()).putTime(e)];
    }
  }
}
