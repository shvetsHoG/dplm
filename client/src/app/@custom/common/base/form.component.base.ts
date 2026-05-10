import { FormGroup, FormArray } from "@angular/forms";

export abstract class FormComponentBase {
  public abstract formGroup: FormGroup;

  public isValidControl(name: string): boolean {
    const control = this.formGroup.get(name?.toString());
    return control?.invalid && (control.dirty || control.touched);
  }

  public isValidCustomControl(name: string, form: FormGroup): boolean {
    const control = form.get(name);

    if (!control) return;

    return control?.invalid && (control.dirty || control.touched);
  }

  public hasValue(name: string): boolean {
    return Boolean(this.formGroup.get(name).value);
  }

  public hasArrayValue(name: string): boolean {
    return Boolean(this.formGroup.get(name).value.length > 0);
  }

  public resetForm(data: any): void {
    this.formGroup.patchValue(data, { emitEvent: false, onlySelf: true });
    this.resetFormValidation();
  }

  public resetFormValidation(): void {
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.formGroup.updateValueAndValidity();
  }

  public isValidForm(withoutUpdate?: boolean): boolean {
    this.formGroup.markAsDirty();
    this.formGroup.markAsTouched();

    this._mark(this.formGroup);

    if (!withoutUpdate) {
      this.formGroup.updateValueAndValidity();
    }
    return this.formGroup.valid;
  }

  public isValidCustomForm(form): boolean {
    form.markAsDirty();
    form.markAsTouched();

    this._mark(form);
    form.updateValueAndValidity();
    return form.valid;
  }

  private _mark(formGroup: FormGroup): void {
    for (const control in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(control)) {
        const group = formGroup.get(control);
        group.markAsDirty();
        group.markAsTouched();
        if (group instanceof FormArray) {
          for (const i in group.controls) {
            if (group.controls.hasOwnProperty(i)) {
              const g = group.get(i);
              if (g instanceof FormGroup) {
                this._mark(g);
                continue;
              }

              group.get(i).markAsDirty();
              group.get(i).markAsTouched();
            }
          }
        }
      }
    }
  }
}
