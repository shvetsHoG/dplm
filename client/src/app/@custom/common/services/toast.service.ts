import { ApplicationRef, ComponentRef, EventEmitter, Injectable, Injector } from "@angular/core";
import { ToastComponent } from "@custom/components/toast/toast.component";
import { ToastParams } from "@custom/components/toast/models/toast-params";
import { ViewContainerService } from "@core/services/view-container.service";

@Injectable()
export class ToastService {
  private static _toasts: Map<string, ComponentRef<ToastComponent>> = new Map();
  constructor(
    private _injector: Injector,
    private _app: ApplicationRef,
    private _viewContainerService: ViewContainerService
  ) {}

  public show(params: ToastParams): void {
    if (!params.key) {
      params.key = Date.now().toString();
      params.showKey = false;
    }
    const toast = this._getToast(params.key, params);
    toast.instance.show();

    const timeout: number = params.timeout ?? 1500;
    setTimeout(() => {
      this.hide(params.key);
    }, timeout);

    this._recalculatePositions();
  }

  public hide(key: string, noDestroy: boolean = false): void {
    const toast = ToastService._toasts.get(key);
    if (!toast) {
      return;
    }

    toast.instance.hide();
    if (noDestroy) {
      return;
    }

    this._destroy(key);
    this._recalculatePositions();
  }

  public eventKey(key: string): EventEmitter<void> {
    const toast = this._getToast(key);
    return toast.instance.keyDown;
  }

  private _recalculatePositions(): void {
    let count: number = 1;
    ToastService._toasts.forEach((item) => {
      if (item.instance.open) {
        item.instance.topPosition = -70 * count;
        count++;
      }
    });
  }

  private _getToast(key: string, params?: ToastParams): ComponentRef<ToastComponent> {
    if (ToastService._toasts.has(key)) {
      const toast = ToastService._toasts.get(key);
      if (params) {
        Object.assign(toast.instance, params);
      }

      return toast;
    }

    const newToast = this._createToast(key, params);
    ToastService._toasts.set(key, newToast);
    return newToast;
  }

  private _createToast(key: string, params: ToastParams): ComponentRef<ToastComponent> {
    const toast = this._viewContainerService.vcr?.createComponent<ToastComponent>(ToastComponent, {
      injector: this._injector
    });

    Object.assign(toast.instance, params);
    toast.instance.key = key;

    (params.parent || document.body).appendChild(toast.location.nativeElement);

    return toast;
  }

  private _destroy(key: string): void {
    const toast = this._getToast(key);
    toast.destroy();
    ToastService._toasts.delete(key);
  }
}
