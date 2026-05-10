import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabsComponent } from "./tabs.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  exports: [TabsComponent],
  declarations: [TabsComponent],
  imports: [CommonModule, TranslateModule]
})
export class TabsModule {}
