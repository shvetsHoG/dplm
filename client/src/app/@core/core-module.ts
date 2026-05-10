import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomCommonModule } from "@custom/common/custom-common.module";
import { IconsModule } from "@custom/components/icons/icons.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  exports: [],
  declarations: [],
  imports: [CommonModule, IconsModule, CustomCommonModule, TranslateModule],
  providers: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CoreModule,
      providers: []
    };
  }
}
