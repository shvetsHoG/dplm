import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectBoxComponent } from "./select-box.component";
import { SelectBoxOverlayComponent } from "./select-box-overlay/select-box-overlay.component";
import { InputModule } from "../input/input.module";
import { IconsModule } from "../icons/icons.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { SearchPanelModule } from "../search-panel/search-panel.module";
import { TranslateModule } from "@ngx-translate/core";
import { TabsModule } from "@custom/components/tabs/tabs.module";

@NgModule({
  exports: [SelectBoxComponent],
  declarations: [SelectBoxComponent, SelectBoxOverlayComponent],
  imports: [CommonModule, InputModule, SearchPanelModule, CustomCommonModule, IconsModule, TranslateModule, TabsModule]
})
export class SelectBoxModule {}
