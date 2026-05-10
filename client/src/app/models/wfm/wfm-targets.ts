export interface WfmTargetsReq {
  absences_percent: number;
  aht_seconds: number;
  on_time_seconds: number;
  service_level_percent: number;
}

export interface WfmTargetsGroupResp {
  active: boolean;
  id: number;
  name: string;
  themeIds: number[];
}

export class WfmTargetsGroup {
  public active: boolean;
  public id: number;
  public name: string;
  public themeIds: number[];

  constructor(data: WfmTargetsGroupResp) {
    Object.assign(this, data);
  }
}

export const WfmTargetsGroupDtoFn = (data: any) =>
  new WfmTargetsGroup({
    active: data.active,
    themeIds: data.theme_ids,
    name: data.name,
    id: data.id
  });

export interface WfmTargetsResp {
  items: WfmTargetsItem[];
  totalCount: number;
}

export class WfmTargets {
  public items: WfmTargetsItem[];
  public totalCount: number;

  constructor(data: WfmTargetsResp) {
    Object.assign(this, data);
  }
}

export const WfmTargetsDtoFn = (data: any) =>
  new WfmTargets({
    items: data.items ? data.items.map((_) => WfmTargetsItemDtoFn(_)) : [],
    totalCount: data.total_count
  });

export interface WfmTargetsItemResp {
  absencesPercent: number;
  ahtSeconds: number;
  dt: string;
  groupId: number;
  groupName: string;
  onTimeSeconds: number;
  serviceLevelPercent: number;
}

export class WfmTargetsItem {
  public absencesPercent: number;
  public ahtSeconds: number;
  public dt: Date;
  public groupId: number;
  public groupName: string;
  public onTimeSeconds: number;
  public serviceLevelPercent: number;

  constructor(data: WfmTargetsItemResp) {
    Object.assign(this, data);

    this.dt = data.dt ? new Date(data.dt) : null;
  }
}

export const WfmTargetsItemDtoFn = (data: any) =>
  new WfmTargetsItem({
    absencesPercent: data.absences_percent,
    dt: data.dt,
    ahtSeconds: data.aht_seconds,
    serviceLevelPercent: data.service_level_percent,
    onTimeSeconds: data.on_time_seconds,
    groupId: data.group?.id,
    groupName: data.group?.name
  });
