import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PeriodComponent } from "./period.component";
import { CalendarModule } from "../calendar/calendar.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { TimeBoxModule } from "../time-box/time-box.module";
import { PeriodDropdownComponent } from "./period-dropdown/period-dropdown.component";
import { IconsModule } from "../icons/icons.module";

@NgModule({
  exports: [PeriodComponent],
  declarations: [PeriodComponent, PeriodDropdownComponent],
  imports: [CommonModule, IconsModule, CalendarModule, TimeBoxModule, CustomCommonModule]
})
export class PeriodModule {}
