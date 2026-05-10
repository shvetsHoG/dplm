import { AppDocumentType } from "../document/document.type";
import { MenuItem } from "@custom/components/menu/models/menu.item";
import { AppDocument } from "../document/document";

export interface ITabInitializer {
  name: string;
  document: MenuItem;
  documentKey?: string;
  hideTab?: boolean;
  selected?: boolean;
  meta?: { name?: any; data: any; info?: any };
  restoreParams?: any;
  routerPath?: any;
  role?: string;
  showCloseButton?: boolean;
  roles?: string[];
  isPin?: boolean;
  reportName?: string;
}

export class Tab {
  public documentKey?: string;
  public id?: any;
  public name: string;
  public selected?: boolean;
  public document?: AppDocument;
  public type?: AppDocumentType;
  public hided?: boolean;
  public showCloseButton?: boolean;
  public items?: any;
  public title?: string;
  public disabled?: boolean;
  public notify?: boolean;
  public isNew?: boolean;
  public isPin?: boolean;
  public reportName?: string;
  public count?: number;

  constructor(
    documentKey: any,
    name: string,
    document?: any,
    hided?: boolean,
    showCloseButton?: boolean,
    isPin?: boolean,
    reportName?: string,
    count?: number
  ) {
    this.documentKey = documentKey;
    this.name = name;
    this.document = document;
    this.hided = hided;
    this.showCloseButton = showCloseButton;
    this.selected = false;
    this.isPin = isPin;
    this.reportName = reportName;
    this.count = count;
  }
}
