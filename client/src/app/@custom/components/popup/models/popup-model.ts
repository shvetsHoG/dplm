import { PopupParams } from "./popup-params";
import { PopupButton } from "./popup-button";
import { Type, TemplateRef, Injector, ViewRef } from "@angular/core";
import { Subject, Observable } from "rxjs";

export class PopupModel {
  public close$: Subject<void> = new Subject();

  public key?: number;
  public title?: string;
  public content?: string;
  public data: any;
  public component?: Type<any>;
  public template?: TemplateRef<any>;
  public accept?: PopupButton;
  public cancel?: PopupButton;
  public buttons?: PopupButton[];
  public parentKey?: number;
  public result?: Observable<any>;
  public width?: string;
  public height?: string;
  public minWidth?: number;
  public maxHeight?: string;
  public headerTemplate?: TemplateRef<any>;
  public footerTemplate?: TemplateRef<any>;
  public injector?: Injector;
  public alignButtons?: "left" | "center" | "right" = "right";
  public verticalPosition?: "flex-start" | "center" | "flex-end";
  public pure?: boolean;
  public controls?: any[];
  public parent?: ViewRef;
  public timeoutClose?: number;
  public timeoutCallback: () => void;
  public hideCloseIcon: boolean;
  public theme?: string;
  public popupWidth?: number;
  public hideButton?: boolean;
  public hideButtonAddition?: boolean;

  constructor(params: PopupParams) {
    this.key = params.key;
    this.title = params.title;
    this.component = params.component;
    this.template = params.template;
    this.content = params.content;
    this.width = params.width;
    this.height = params.height;
    this.minWidth = params.minWidth;
    this.headerTemplate = params.headerTemplate;
    this.footerTemplate = params.footerTemplate;
    this.accept = params.accept ? new PopupButton(params.accept, this._innerCommand) : null;
    this.cancel = params.cancel ? new PopupButton(params.cancel, this._innerCommand) : null;
    this.injector = params.injector;
    this.data = params.data;
    this.alignButtons = params.alignButtons ? params.alignButtons : "left";
    this.verticalPosition = params.verticalPosition ? params.verticalPosition : "center";
    this.pure = params.pure;
    this.parent = params.parent;
    this.timeoutClose = params.timeoutClose;
    this.hideCloseIcon = params.hideCloseIcon;
    this.hideButton = params.hideButton;
    this.hideButtonAddition = params.hideButtonAddition;
    this.theme = params.theme;
    this.popupWidth = params.popupWidth;
    if (this.timeoutClose) {
      this.timeoutCallback = params.timeoutCallback;
    }

    if (params.component && (params.component as any).title) {
      this.title = (params.component as any).title;
    }

    if (params.component && (params.component as any).buttons) {
      this.buttons = (params.component as any).buttons.map((i: any) => new PopupButton(i, this._innerCommand));
    } else {
      this.buttons = params.buttons ? params.buttons.map((i: any) => new PopupButton(i, this._innerCommand)) : null;
    }
  }

  private _innerCommand = (button: PopupButton, e?: any): void => {
    this.close$.next(null);
    if (button.callback) {
      button.callback(e);
    }
  };

  public close(): void {
    this.close$.next(null);
  }

  public setLoader(loader$: Observable<boolean>): void {
    loader$.subscribe((bool) => (this.accept.loading = bool));
  }

  public getButtonByName(name: string): PopupButton {
    return this.buttons.find((i: any) => i.text === name);
  }
}
