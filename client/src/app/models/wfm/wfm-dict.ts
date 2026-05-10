import { WeekDayType } from "app/models/wfm/wfm";

export interface WfmContractTypeResp {
  id: number;
  name: string;
  type: string;
}

export class WfmContractType {
  public id: number;
  public name: string;
  public type: string;

  constructor(data: WfmContractTypeResp) {
    Object.assign(this, data);
  }
}

export const WfmContractTypesDtoFn = (data: any) =>
  new WfmContractType({
    id: data.id,
    name: data.name,
    type: data.type
  });

export interface WfmWeekDayResp {
  fullname: string;
  isWeekend: boolean;
  number: number;
  shortname: string;
}

export class WfmWeekDay {
  public fullname: string;
  public isWeekend: boolean;
  public number: number;
  public shortname: string;
  public type: WeekDayType;

  constructor(data: WfmWeekDayResp) {
    Object.assign(this, data);
  }
}

export const WfmWeekDaysDtoFn = (data: any) =>
  new WfmWeekDay({
    fullname: data.fullname,
    isWeekend: data.is_weekend,
    number: data.number,
    shortname: data.shortname
  });

export interface WfmEventTypeResp {
  color: string;
  id: number;
  name: string;
}

export class WfmEventType {
  public color: string;
  public id: number;
  public name: string;

  constructor(data: WfmEventTypeResp) {
    Object.assign(this, data);
  }
}

export const WfmEventTypesDtoFn = (data: any) =>
  new WfmEventType({
    color: data.color,
    id: data.id,
    name: data.name
  });
