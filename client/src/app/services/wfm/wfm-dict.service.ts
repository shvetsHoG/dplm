import { Injectable } from "@angular/core";
import { ServiceBase } from "@custom/common/base/service.base";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import {
  WfmContractType,
  WfmContractTypesDtoFn,
  WfmEventType,
  WfmEventTypesDtoFn,
  WfmWeekDay,
  WfmWeekDaysDtoFn
} from "app/models/wfm/wfm-dict";
import { Observable } from "rxjs";
import { RxFn } from "rxfn";

const URL = `api/wfm`;

@Injectable()
export class WfmDictService extends ServiceBase {
  constructor(
    _http: HttpClient,
    _errorService: ErrorHandlerService,
    public handler: HttpBackend
  ) {
    super(_http, null, _errorService);
  }

  public getContractTypes = new RxFn<WfmContractType[]>(this._getContractTypes.bind(this));
  public getWeekDays = new RxFn<WfmWeekDay[]>(this._getWeekDays.bind(this));
  public getEventTypes = new RxFn<WfmEventType[]>(this._getEventTypes.bind(this));

  private _getContractTypes(): Observable<WfmContractType[]> {
    return this.get(`${URL}/web/v1/dict/contract_types`, WfmContractTypesDtoFn);
  }

  private _getWeekDays(): Observable<WfmContractType[]> {
    return this.get(`${URL}/web/v1/dict/weekdays`, WfmWeekDaysDtoFn);
  }

  private _getEventTypes(): Observable<WfmEventType[]> {
    return this.get(`${URL}/web/v1/dict/event_types`, WfmEventTypesDtoFn);
  }
}
