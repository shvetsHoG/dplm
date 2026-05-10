import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchPanelComponent } from "./search-panel.component";
import { InputModule } from "../input/input.module";
import { IconsModule } from "../icons/icons.module";

@NgModule({
  declarations: [SearchPanelComponent],
  exports: [SearchPanelComponent],
  imports: [CommonModule, InputModule, IconsModule]
})
export class SearchPanelModule {}
