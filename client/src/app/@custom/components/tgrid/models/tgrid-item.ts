import { TGridDetailComponent } from "../tgrid-detail/tgrid-detail.component";

export class TGridItem<T = any> {
  public groupValue: any;

  constructor(
    public id: any,
    public data: T,
    public index: number,
    public expand?: boolean,
    public visible?: boolean,
    public selected?: boolean,
    public detail?: any
  ) {}
}
