import { WeekDayType } from "app/models/wfm/wfm";

export interface WFMContractsShiftResp {
  customDays: {
    type: WeekDayType;
    weeknumber: number;
  }[];
  duration: number;
  id: number;
  name: string;
  startDate: string;
  startTime: string;
  type: string;
}

export class WFMContractsShift {
  public customDays: {
    type: WeekDayType;
    weeknumber: number;
  }[] = [];
  public duration: number;
  public id: number;
  public startDate: string;
  public startTime: string;
  public type: string;
  public name: string;

  constructor(data: WFMContractsShiftResp) {
    Object.assign(this, data);
  }
}

export interface WFMEmployeeGroupResp {
  employees: { fullname: string; id: number }[];
  externalId: number;
  name: string;
}

export class WFMEmployeeGroup {
  employees: { fullname: string; id: number }[];
  externalId: number;
  name: string;

  constructor(data: WFMEmployeeGroupResp) {
    Object.assign(this, data);
  }
}

export interface WFMFullContractResp {
  employeeGroups: WFMEmployeeGroupResp[];
  id: 1;
  name: string;
  shift: WFMContractsShiftResp;
}

export class WFMFullContract {
  public employeeGroups: WFMEmployeeGroup[];
  public id: number;
  public name: string;
  public shift: WFMContractsShift;

  constructor(data: WFMFullContractResp) {
    Object.assign(this, data);
  }
}

export const WFMFullContractDtoFn = (data: any) =>
  new WFMFullContract({
    employeeGroups: data.employee_groups ? data.employee_groups.map((i: any) => WFMFullContractEmployeeGroupsDtoFn(i)) : [],
    id: data.id,
    name: data.name,
    shift: WFMContractsShiftDtoFn(data.shift) || null
  });

export const WFMFullContractEmployeeGroupsDtoFn = (data: any) =>
  new WFMEmployeeGroup({
    employees: data.employees,
    externalId: data.external_id,
    name: data.name
  });

export const WFMContractsShiftDtoFn = (data: any) =>
  new WFMContractsShift({
    name: data.name,
    customDays: data.custom_days,
    duration: data.duration,
    id: data.id,
    type: data.type,
    startTime: data.start_time,
    startDate: data.start_date
  });

export interface WFMContractResp {
  employeeCount: number;
  id: number;
  name: string;
  shiftName: string;
}

export class WFMContract {
  public employeeCount: number;
  public id: number;
  public name: string;
  public shiftName: string;

  constructor(data: WFMContractResp) {
    Object.assign(this, data);
  }
}

export const WFMContractDtoFn = (data: any) =>
  new WFMContract({
    id: data.id,
    name: data.name,
    employeeCount: data.employee_count,
    shiftName: data.shift_name
  });

export interface WFMContractsResp {
  contracts: WFMContractResp[];
  totalCount: number;
}

export class WFMContracts {
  public contracts: WFMContract[] = [];
  public totalCount: number;

  constructor(data: WFMContractsResp) {
    Object.assign(this, data);
  }
}

export const WFMContractsDtoFn = (data: any) =>
  new WFMContracts({
    contracts: data.contracts ? data.contracts.map((i: any) => WFMContractDtoFn(i)) : [],
    totalCount: data.total_count
  });

export interface WFMContractsReq {
  name: string;
  shift: WFMContractsShiftReq;
}

export interface WFMContractsShiftReq {
  custom_days: {
    type: WeekDayType;
    weeknumber: number;
  }[];
  duration: number;
  id: number;
  start_date: string;
  start_time: string;
}

export interface WFMEmployeeAssignResp {
  employee: {
    fullname: string;
    id: number;
  };
  team: {
    external_id: number;
    name: string;
  };
}
