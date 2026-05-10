import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarComponent } from "./calendar.component";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { ButtonModule } from "../button/button.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    exports: [CalendarComponent],
    declarations: [CalendarComponent],
    imports: [CommonModule, CustomCommonModule, ButtonModule, TranslateModule]
})
export class CalendarModule { }
