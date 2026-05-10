import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TooltipComponent } from "./tooltip.component";
import { TooltipDirective } from "./tooltip.directive";

@NgModule({
    exports: [TooltipDirective],
    declarations: [TooltipComponent, TooltipDirective],
    imports: [CommonModule]
})
export class TooltipModule {}
