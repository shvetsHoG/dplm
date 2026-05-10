import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateBoxComponent } from "./date-box.component";
import { ButtonModule } from "../button/button.module";
import { CustomCommonModule } from "../../common/custom-common.module";
import { CalendarModule } from "../calendar/calendar.module";
import { InputModule } from "../input/input.module";
import { IconsModule } from "../icons/icons.module";
import { TimeBoxModule } from "../time-box/time-box.module";

@NgModule({
  exports: [DateBoxComponent],
  declarations: [DateBoxComponent],
  imports: [
    CommonModule,
    CustomCommonModule,
    ButtonModule,
    CalendarModule,
    ButtonModule,
    InputModule,
    IconsModule,
    TimeBoxModule
  ]
})
export class DateBoxModule {}
