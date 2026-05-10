import { Injectable, ViewRef } from "@angular/core";
import { PopupService } from "app/@custom/components/popup/popup.service";
import { PopupModel } from "app/@custom/components/popup/models/popup-model";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, filter, takeUntil } from "rxjs/operators";
import { ErrorDialogComponent } from "../components/error-dialog/error-dialog.component";
import { ToastService } from "./toast.service";

export interface ErrorModel {
  date?: Date;
  message: string;
  request?: string;
  response?: string;
  url?: string;
}

@Injectable({ providedIn: "root" })
export class ErrorHandlerService {
  private _popup: PopupModel;
  private _errors$: BehaviorSubject<ErrorModel[]> = new BehaviorSubject(null);

  private _destroy$ = new Subject<void>();

  constructor(
    private _popupService: PopupService,
    private _toastService: ToastService
  ) {
    this._errors$.pipe(filter((i: any) => i !== null)).subscribe((errors) => {
      this._popup.data = errors;
    });
  }

  public showError(err: ErrorModel, parent?: ViewRef, title?: string, isNotification?: boolean): void {
    err.date = new Date();
    if (this._popup) {
      this._addErr(err);
      return;
    }

    this._popup = this._popupService.open({
      title: title ? title : "ERROR",
      component: ErrorDialogComponent,
      alignButtons: "right",
      accept: isNotification ? null : { text: "REPORT_BUG" },
      cancel: { text: "CLOSE", callback: this._closePopup.bind(this) },
      parent
    });

    this._setErr(err);
  }

  private _closePopup(): void {
    this._popup.close$.next(null);
    this._popup = null;
    this._delErr();
  }

  private _delErr(): void {
    this._errors$.next(null);
  }

  private _setErr(err: ErrorModel): void {
    this._errors$.next([err]);
  }

  private _addErr(err: ErrorModel): void {
    this._errors$.next([err, ...this._errors$.getValue()]);
  }
}
