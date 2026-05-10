import { RouterServiceBase } from "@core/services/base/router.service.base";
import { RolesType } from "@core/models/enums/roles-type";

export class MenuItem {
  public isContainer?: boolean;

  constructor(
    public name: string,
    public items?: MenuItem[],
    public type?: number,
    public controller?: any,
    public lazyLoad?: boolean,
    public command?: () => any,
    public hideInMenu?: boolean,
    public hideInSearch?: boolean,
    public single?: boolean,
    public icon?: any,
    public iconValue?: number,
    public role?: RolesType,
    public disabled?: (() => boolean) | boolean,
    public hideTab?: boolean,
    public router?: typeof RouterServiceBase,
    public template?: any,
    public component?: any,
    public injector?: any,
    public showTooltip?: boolean,
    public showCloseButton?: boolean,
    public roles?: RolesType[],
    public reportName?: string
  ) {
    this.showCloseButton = true;
  }
}
