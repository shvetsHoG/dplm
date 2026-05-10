import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PaginatorComponent } from "./paginator.component";
import { PaginatorDirective } from "./paginator.directive";
import { IconsModule } from "../icons/icons.module";
import { TooltipModule } from "../tooltip/tooltip.module";
import { InputModule } from "../input/input.module";

@NgModule({
  imports: [CommonModule, IconsModule, InputModule, TooltipModule],
  exports: [PaginatorComponent],
  declarations: [PaginatorComponent, PaginatorDirective]
})
export class PaginatorModule {}
