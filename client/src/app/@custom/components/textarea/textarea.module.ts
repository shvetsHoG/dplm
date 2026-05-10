import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextareaComponent } from "./textarea.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  exports: [TextareaComponent],
  declarations: [TextareaComponent],
  imports: [CommonModule, TranslateModule]
})
export class TextareaModule {}
