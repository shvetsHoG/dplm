import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeBoxComponent } from "./time-box.component";
import { TimeBoxOverlayComponent } from "./time-box-overlay/time-box-overlay.component";
import { InputModule } from "../input/input.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";

@NgModule({
    exports: [TimeBoxComponent, TimeBoxOverlayComponent],
    declarations: [TimeBoxComponent, TimeBoxOverlayComponent],
    imports: [CommonModule, InputModule, CustomCommonModule]
})
export class TimeBoxModule {}
