import { Component, output, OutputEmitterRef } from "@angular/core";
import { FormComponentBase } from "@custom/common/base/form.component.base";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthorizationService } from "app/services/authorization/authorization.service";
import { take, takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";

interface FormBlock {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  providers: [DestroyService]
})
export class LoginComponent extends FormComponentBase {
  public readonly formGroup: FormGroup<FormBlock>;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthorizationService,
    private _destroy$: DestroyService
  ) {
    super();

    this.formGroup = this._fb.group<FormBlock>({
      email: this._fb.control(null, Validators.required),
      password: this._fb.control(null, Validators.required)
    });
  }
  public onAuth(): void {
    const form = this.formGroup.getRawValue();

    this._authService
      .authorize("login", form)
      .pipe(take(1), takeUntil(this._destroy$))
      .subscribe(() => {});
  }
}
