import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "./button.component";
import { IconsModule } from "../icons/icons.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  exports: [ButtonComponent],
  declarations: [ButtonComponent],
  imports: [CommonModule, IconsModule, TranslateModule]
})
export class ButtonModule {}
