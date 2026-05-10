import { TGridFilterMode } from "./tgrid-filter-mode";

export class TGridFilter {
  public mode: TGridFilterMode = TGridFilterMode.Equal;

  constructor(
    public key: string,
    public checked = false
  ) {}
}
