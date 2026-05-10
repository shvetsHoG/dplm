import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CheckboxComponent } from "./checkbox.component";

@NgModule({
  exports: [CheckboxComponent],
  declarations: [CheckboxComponent],
  imports: [CommonModule]
})
export class CheckboxModule {}
