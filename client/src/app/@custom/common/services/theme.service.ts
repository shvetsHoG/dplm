import { Injectable, Optional } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CustomThemeType } from "@custom/models/custom-theme-type";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private _theme$ = new BehaviorSubject<CustomThemeType>(null);
  public theme$ = this._theme$.pipe(filter((i: any) => i !== null));

  constructor(@Optional() _theme: CustomThemeType) {
    this._theme$.next(_theme || CustomThemeType.light);
  }

  public setTheme(theme: CustomThemeType): void {
    this._theme$.next(theme);
  }

  public getTheme(): CustomThemeType {
    return this._theme$.getValue();
  }
}
