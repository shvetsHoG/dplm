import { shiftType, WeekDayType } from "app/models/wfm/wfm";

export interface WfmItemsResp {
  items: WfmEmployeesEvent[];
  totalCount: number;
}

export class WfmItems {
  public items: WfmEmployeesEvent[];
  public totalCount: number;

  constructor(data: WfmItemsResp) {
    Object.assign(this, data);
  }
}

export const WfmItemsDtoFn = (data: any) =>
  new WfmItems({
    items: data.items ? data.items.map((_) => WfmEmployeesEventDtoFn(_)) : [],
    totalCount: data.total_count
  });

export interface WfmEmployeesEventResp {
  employee: WfmEmployee;
  events: WfmEvent[];
  contracts: WfmSchedule[];
}

export class WfmEmployeesEvent {
  public employee: WfmEmployee;
  public events: WfmEvent[];
  public contracts: WfmSchedule[];

  constructor(data: WfmEmployeesEventResp) {
    Object.assign(this, data);
  }
}

export const WfmEmployeesEventDtoFn = (data: any) =>
  new WfmEmployeesEvent({
    employee: data.employee ? WfmEmployeeDtoFn(data.employee) : null,
    events: data.events ? data.events.map((_) => WfmEventDtoFn(_)) : [],
    contracts: data.contracts ? data.contracts.map((_) => WfmScheduleDtoFn(_)) : []
  });

export interface WfmEmployeeResp {
  fullname: string;
  id: number;
}

export class WfmEmployee {
  public fullname: string;
  public id: number;

  constructor(data: WfmEmployeeResp) {
    Object.assign(this, data);
  }
}

export const WfmEmployeeDtoFn = (data: any) =>
  new WfmEmployee({
    fullname: data.fullname,
    id: data.id
  });

export interface WfmEventResp {
  desc: string;
  endDt: string;
  id: number;
  startDt: string;
  type: WfmEventType;
}

export class WfmEvent {
  public desc: string;
  public endDt: Date;
  public id: number;
  public startDt: Date;
  public type: WfmEventType;

  constructor(data: WfmEventResp) {
    Object.assign(this, data);
    this.endDt = data.endDt ? new Date(data.endDt) : null;
    this.startDt = data.startDt ? new Date(data.startDt) : null;
  }
}

export const WfmEventDtoFn = (data: any) =>
  new WfmEvent({
    desc: data.desc,
    endDt: data.end_dt,
    id: data.id,
    startDt: data.start_dt,
    type: data.type ? WfmEventTypeDtoFn(data.type) : null
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

export const WfmEventTypeDtoFn = (data: any) =>
  new WfmEventType({
    color: data.color,
    id: data.id,
    name: data.name
  });

export interface WfmScheduleResp {
  endDt: string;
  shift: WfmScheduleShift;
  startDt: string;
}

export class WfmSchedule {
  public endDt: Date;
  public shift: WfmScheduleShift;
  public startDt: Date;

  constructor(data: WfmScheduleResp) {
    Object.assign(this, data);
    this.endDt = data.endDt ? new Date(data.endDt) : null;
    this.startDt = data.startDt ? new Date(data.startDt) : null;
  }
}

export const WfmScheduleDtoFn = (data: any) =>
  new WfmSchedule({
    endDt: data.end_dt,
    shift: data.shift ? WfmScheduleShiftDtoFn(data.shift) : null,
    startDt: data.start_dt
  });

export interface WfmScheduleShiftResp {
  customDays: WfmScheduleShiftCustomDays[];
  cycleBlocks: WfmScheduleShiftCycleBlocks[];
  duration: number;
  startTime: string;
  startDate: string;
  type: shiftType;
}

export class WfmScheduleShift {
  public customDays: WfmScheduleShiftCustomDays[];
  public cycleBlocks: WfmScheduleShiftCycleBlocks[];
  public duration: number;
  public startTime: Date;
  public startDate: Date;
  public type: shiftType;

  constructor(data: WfmScheduleShiftResp) {
    Object.assign(this, data);
    this.startTime = data.startTime ? new Date(data.startTime) : null;
    this.startDate = data.startDate ? new Date(data.startDate) : null;
  }
}

export const WfmScheduleShiftDtoFn = (data: any) =>
  new WfmScheduleShift({
    customDays: data.custom_days ? data.custom_days.map((_) => WfmScheduleShiftCustomDaysDtoFn(_)) : [],
    cycleBlocks: data.cycle_blocks ? data.cycle_blocks.map((_) => WfmScheduleShiftCycleBlocksDtoFn(_)) : [],
    duration: data.duration,
    startTime: data.start_time,
    startDate: data.start_date,
    type: data.type
  });

export interface WfmScheduleShiftCustomDaysResp {
  type: WeekDayType;
  weeknumber: number;
}

export class WfmScheduleShiftCustomDays {
  public type: WeekDayType;
  public weeknumber: number;

  constructor(data: WfmScheduleShiftCustomDaysResp) {
    Object.assign(this, data);
  }
}

export const WfmScheduleShiftCustomDaysDtoFn = (data: any) =>
  new WfmScheduleShiftCustomDays({
    type: data.type,
    weeknumber: data.weeknumber
  });

export interface WfmScheduleShiftCycleBlocksResp {
  daysCount: number;
  order: number;
  type: WeekDayType;
}

export class WfmScheduleShiftCycleBlocks {
  public daysCount: number;
  public order: number;
  public type: WeekDayType;

  constructor(data: WfmScheduleShiftCycleBlocksResp) {
    Object.assign(this, data);
  }
}

export const WfmScheduleShiftCycleBlocksDtoFn = (data: any) =>
  new WfmScheduleShiftCycleBlocks({
    daysCount: data.days_count,
    order: data.order,
    type: data.type
  });

export interface WfmEmployeesEventReq {
  desc: string;
  end_dt: string;
  event_type_id: number;
  start_dt: string;
}

export enum WfmEventColors {
  WEEKDAY = "#FCFCFC",
  WORKDAY = "#E6FFE6"
}
