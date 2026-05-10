import { Injector, NgModuleFactory } from "@angular/core";
import { InitializerBase } from "../base/initializer.base";
import { AppDocumentType } from "./document.type";
import { Model } from "../base/model";
import { ServiceLocator } from "@core/services/service.locator";
import { RouterServiceBase } from "@core/services/base/router.service.base";

export interface IDocumentInitializer {
  name: string;
  key: string;
  parentKey?: string;
  type?: AppDocumentType;
  controller?: any;
  router?: typeof RouterServiceBase;
  meta?: { name?: string; data?: any; providerName?: string; extend?: any; info?: any };
  single?: boolean;
  selected?: boolean;
  role?: string;
  restoreParams?: any;
  routerPath?: any;
  lazyLoad?: boolean;
  injector?: Injector;
  isPin?: boolean;
  reportName?: string;
  serviceUrl?: string;
}

export class DocumentInitializer extends InitializerBase implements IDocumentInitializer {
  public meta: { name: string; providerName?: string; info?: any };
  public name: string;
  public role: string;
  public router;
  public restoreParams: any;
  public routerPath: any;
  public lazyLoad: boolean;
  public parentKey: string;
  public type: AppDocumentType;
  public isPin: boolean;
  public reportName: string;
  public serviceUrl: string;

  public injector: Injector;
  public customInjector: Injector;
  public model: Model<any>;
  public factory: NgModuleFactory<any>;

  constructor(
    name: string,
    key: string,
    parentKey: string,
    type?: AppDocumentType,
    controller?: any,
    meta?: { name?: string; data?: any; providerName?: string; info?: any },
    role?: string,
    restoreParams?: any,
    routerPath?: any,
    lazyLoad?: boolean,
    injector?: Injector,
    isPin?: boolean,
    reportName?: string,
    serviceUrl?: string
  ) {
    super(key, controller, meta ? meta.data : null);
    this.name = name;
    this.lazyLoad = lazyLoad;
    this.restoreParams = restoreParams;
    this.routerPath = routerPath;
    this.role = role;
    this.parentKey = parentKey;
    this.type = type || AppDocumentType.Document;
    this.meta = meta ? { name: meta.name, providerName: meta.providerName, info: meta?.info } : null;
    this.model = Object.create(new Model<any>());
    this.injector = injector;
    this.isPin = isPin;
    this.reportName = reportName;
    this.serviceUrl = serviceUrl;
    if (meta && meta.providerName && meta.data) {
      this.createInjector(meta.providerName, meta.data);
    }
  }

  createInjector = (providerName: any, data: any) => {
    this.injector = Injector.create({
      providers: [
        {
          provide: providerName,
          useFactory: () => data,
          deps: []
        }
      ],
      parent: this.injector || ServiceLocator.injector
    });
  };
}
