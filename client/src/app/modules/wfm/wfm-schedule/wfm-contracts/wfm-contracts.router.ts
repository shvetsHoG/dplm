import { RouterServiceBase, RouterConfigModel } from "@core/services/base/router.service.base";
import { Injectable } from "@angular/core";

export enum WfmContractsRouterType {
  path = "PATH",
  id = "ID"
}

@Injectable()
export class WfmContractsRouterService extends RouterServiceBase {
  config: RouterConfigModel[] = [
    { path: WfmContractsRouterType.path, value: ":PATH" },
    {
      path: WfmContractsRouterType.id,
      value: ":ID"
    }
  ];
}
