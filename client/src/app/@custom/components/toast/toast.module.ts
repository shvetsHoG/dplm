import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastComponent } from "./toast.component";
import { TimeIntervalModule } from "../time-interval/time-interval.module";
import { IconsModule } from "../icons/icons.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    exports: [ToastComponent],
    declarations: [ToastComponent],
    imports: [CommonModule, TimeIntervalModule, IconsModule, TranslateModule]
})
export class ToastModule {}
