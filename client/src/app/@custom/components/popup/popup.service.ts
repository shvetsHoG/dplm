import {
  Injectable,
  Injector,
  ComponentRef,
  ApplicationRef,
  ViewRef,
  Optional,
  Inject,
  ViewContainerRef,
  ComponentFactoryResolver
} from "@angular/core";
import { PopupComponent } from "./popup.component";
import { PopupOverlayComponent } from "./popup-overlay/popup-overlay.component";
import { PopupParams } from "./models/popup-params";
import { PopupModel } from "./models/popup-model";
import { AppDocument } from "@core/models/document/document";
import { TimeIntervalService } from "@custom/common/services/time-interval.service";
import { take } from "rxjs/operators";
import { ViewContainerService } from "@core/services/view-container.service";

class PopupObject {
  constructor(
    public popup: ComponentRef<PopupComponent>,
    public overlay: ComponentRef<PopupOverlayComponent>,
    public params: PopupModel
  ) {}
}

@Injectable({ providedIn: "root" })
export class PopupService {
  private readonly OVERLAY_OPACITY = 0.3;
  private _popups: Map<number, PopupObject> = new Map();

  private _vcr: ViewContainerRef;

  constructor(
    private _injector: Injector,
    private _appRef: ApplicationRef,
    private _interval: TimeIntervalService,
    private _viewContainerService: ViewContainerService,
    @Optional() @Inject("document") private document: AppDocument
  ) {}

  public open(params: PopupParams): PopupModel {
    params.key = params.key || Date.now();

    if (this._popups.has(params.key)) {
      this._close(params.key);
    }

    if (params.parentKey) {
      this._hideParentPopup(params.parentKey);
    }

    const overlay = this._createOverlay(params.parent);
    const model = new PopupModel(params);

    overlay.instance.zIndex = params?.zIndex;

    overlay.instance.overlayClick.subscribe(() => {
      if (params.overlayClose) {
        model.close();
      }
    });
    const popup = this._createPopup(model, overlay);
    this._popups.set(params.key, new PopupObject(popup, overlay, model));
    return model;
  }

  public close(key: number): void {
    if (!this._popups.has(key)) {
      console.warn(`popup is "${key}" not found`);
      return;
    }

    const obj = this._popups.get(key);

    if (obj.params.parentKey) {
      this._showParentPopup(obj.params.parentKey);
    }

    this._close(key);
  }

  private _hideParentPopup(key: number): void {
    if (!this._popups.has(key)) {
      return;
    }

    const obj = this._popups.get(key);
    obj.overlay.instance.hidden = true;
  }

  private _showParentPopup(key: number): void {
    if (!this._popups.has(key)) {
      return;
    }

    const obj = this._popups.get(key);
    obj.overlay.instance.hidden = false;
  }

  private _close(key: number): void {
    const obj = this._popups.get(key);
    this._destroy(obj);
    this._popups.delete(key);
  }

  private _createPopup(model: PopupModel, overlay: ComponentRef<PopupOverlayComponent>): ComponentRef<PopupComponent> {
    const componentRef = overlay.instance.viewContainer.createComponent<PopupComponent>(PopupComponent, {
      injector: this._injector
    });

    componentRef.instance.model = model;
    const closeSubs = model.close$.subscribe(() => this._close(model.key));
    componentRef.onDestroy(() => closeSubs.unsubscribe());
    if (model.timeoutClose) {
      this._startTimeoutClose(model);
    }

    return componentRef;
  }

  private _startTimeoutClose(model: PopupModel): void {
    this._interval
      .getInterval(model.timeoutClose, model.timeoutClose)
      .pipe(take(1))
      .subscribe((_) => {
        model.close();
        if (model.timeoutCallback) {
          model.timeoutCallback();
        }
      });
  }

  private _createOverlay(parent?: ViewRef): ComponentRef<PopupOverlayComponent> {
    const componentRef = this._viewContainerService.vcr?.createComponent<PopupOverlayComponent>(PopupOverlayComponent, {
      injector: this._injector
    });
    componentRef.instance.opacity = this.OVERLAY_OPACITY;

    if (this.document && this.document.viewRef) {
      (this.document.viewRef as any).rootNodes[1].appendChild(componentRef.location.nativeElement);
    } else {
      document.body.firstElementChild.appendChild(componentRef.location.nativeElement);
    }

    componentRef.onDestroy(() => {
      this._appRef.detachView(componentRef.hostView);
    });

    return componentRef;
  }

  private _destroy(obj: PopupObject): void {
    this._destroyPopup(obj.popup);
    this._destroyOverlay(obj.overlay);
  }

  private _destroyPopup(ref: ComponentRef<PopupComponent>): void {
    ref.destroy();
  }

  private _destroyOverlay(ref: ComponentRef<PopupOverlayComponent>): void {
    ref.destroy();
    this._appRef.tick();
  }
}
