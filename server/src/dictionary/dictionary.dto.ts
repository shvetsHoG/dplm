export interface WeekDaysResp {
    id: number;
    fullname: string;
    shortname: string;
    number: number;
    isWeekend: boolean;
}

export interface ContractTypesResp {
    id: number;
    name: string;
    type: string;
}

export interface EventTypesResp {
    id: number;
    name: string;
    color: string;
}
