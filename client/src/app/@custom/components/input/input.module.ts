import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputComponent } from "./input.component";
import { IconsModule } from "../icons/icons.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  exports: [InputComponent],
  declarations: [InputComponent],
  imports: [CommonModule, IconsModule, TranslateModule]
})
export class InputModule { }
