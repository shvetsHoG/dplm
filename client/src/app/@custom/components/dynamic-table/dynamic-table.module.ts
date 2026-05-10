import { NgModule } from "@angular/core";
import { DynamicTableComponent } from "@custom/components/dynamic-table/dynamic-table.component";
import { CommonModule } from "@angular/common";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { IconsModule } from "@custom/components/icons/icons.module";

@NgModule({
  declarations: [DynamicTableComponent],
  exports: [DynamicTableComponent],
  imports: [CommonModule, CustomCommonModule, IconsModule]
})
export class DynamicTableModule {}
