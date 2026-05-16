import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { CustomModule } from "@custom/custom-module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  imports: [CommonModule, CustomModule, ReactiveFormsModule]
})
export class LoginModule {}
