import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SvgIconService } from "./svg-icon/svg-icon.service";
import { SvgIconComponent } from "./svg-icon/svg-icon.component";
import { SvgIconPathProvide } from "./models/svg-icon-path-provide";

@NgModule({
  exports: [SvgIconComponent],
  declarations: [SvgIconComponent],
  imports: [CommonModule],
  providers: [SvgIconService, { provide: SvgIconPathProvide, useValue: "icons/svg" }]
})
export class IconsModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: IconsModule,
      providers: [SvgIconService, { provide: SvgIconPathProvide, useValue: "icons/svg" }]
    };
  }

  constructor(private _iconService: SvgIconService) {
    this._preloadSvgIcons();
  }

  private _preloadSvgIcons(): void {}
}
