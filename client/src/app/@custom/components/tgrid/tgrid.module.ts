import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TGridComponent } from "./tgrid.component";
import { TGridColumnComponent } from "./tgrid-column/tgrid-column.component";
import { TGridFilterComponent } from "./tgrid-filter/tgrid-filter.component";
import { TGridOverlayComponent } from "./tgrid-overlay/tgrid-overlay.component";
import { PaginatorModule } from "../paginator";
import { TGridDetailComponent } from "./tgrid-detail/tgrid-detail.component";
import { InputModule } from "../input/input.module";
import { ButtonModule } from "../button/button.module";
import { CheckboxModule } from "../checkbox/checkbox.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { TooltipModule } from "../tooltip/tooltip.module";

@NgModule({
    exports: [TGridComponent, TGridColumnComponent],
    declarations: [
        TGridComponent,
        TGridColumnComponent,
        TGridFilterComponent,
        TGridOverlayComponent,
        TGridDetailComponent
    ],
    imports: [
        CommonModule,
        PaginatorModule,
        InputModule,
        ButtonModule,
        CheckboxModule,
        CustomCommonModule,
        TooltipModule
    ]
})
export class TGridModule {}
