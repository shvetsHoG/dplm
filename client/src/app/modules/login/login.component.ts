import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";
import { FormComponentBase } from "@custom/common/base/form.component.base";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthorizationService } from "app/services/authorization/authorization.service";
import { catchError, take, takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";
import { of } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";
import { NavigationService } from "app/services/navigation-service";

interface FormBlock {
  email: FormControl<string>;
  password: FormControl<string>;
  name: FormControl<string>;
}

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  providers: [DestroyService]
})
export class LoginComponent extends FormComponentBase {
  isReg: InputSignal<boolean> = input<boolean>(false);

  public readonly formGroup: FormGroup<FormBlock>;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthorizationService,
    private _destroy$: DestroyService,
    private _navigationService: NavigationService
  ) {
    super();

    this.formGroup = this._fb.group<FormBlock>({
      email: this._fb.control(null, Validators.required),
      password: this._fb.control(null, Validators.required),
      name: this._fb.control(null)
    });

    toObservable(this.isReg)
      .pipe(takeUntil(this._destroy$))
      .subscribe((isReg) => {
        if (isReg) {
          this.formGroup.controls.name.setValidators(Validators.required);
          this.formGroup.controls.name.updateValueAndValidity();
        } else {
          this.formGroup.controls.name.clearValidators();
          this.formGroup.controls.name.updateValueAndValidity();
        }
      });
  }

  public redirectTo(type: "login" | "registration"): void {
    this._navigationService.navigate(type);
  }

  public onAuth(): void {
    if (!this.isValidForm()) return;

    const form = this.formGroup.getRawValue();

    this._authService
      .authorize(this.isReg() ? "registration" : "login", form)
      .pipe(
        take(1),
        catchError(() => {
          this._authService.isAuth.set(false);

          this.formGroup.controls.email.setValue(null);
          this.formGroup.controls.password.setValue(null);

          if (this.isReg()) {
            this.formGroup.controls.name.setValue(null);
          }

          return of(null);
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }
}
