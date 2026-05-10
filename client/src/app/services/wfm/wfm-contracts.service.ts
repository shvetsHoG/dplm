import { Injectable } from "@angular/core";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { ServiceBase } from "@custom/common/base/service.base";
import { Observable } from "rxjs";
import {
  WFMContracts,
  WFMContractsDtoFn,
  WFMContractsReq,
  WFMEmployeeAssignResp,
  WFMFullContract,
  WFMFullContractDtoFn
} from "app/models/wfm/wfm-contracts";
import { RxFn } from "rxfn";
import { ObjectHelper } from "@custom/extensions/object-helper.extensions";

const URL = `/api/wfm`;

@Injectable()
export class WfmContractsService extends ServiceBase {
  constructor(
    _http: HttpClient,
    _errorService: ErrorHandlerService,
    public handler: HttpBackend
  ) {
    super(_http, null, _errorService);
  }

  public getContracts = new RxFn<WFMContracts, [number, number]>(this._getContracts.bind(this));
  public createContract = new RxFn<{ id: number }, WFMContractsReq>(this._createContract.bind(this));
  public getContract = new RxFn<WFMFullContract, string>(this._getContract.bind(this));
  public deleteContract = new RxFn<WFMFullContract, string>(this._deleteContract.bind(this));
  public updateContract = new RxFn<void, [string, WFMContractsReq]>(this._changeContract.bind(this));
  public unassignEmployee = new RxFn<void, [string, string]>(this._unassignEmployee.bind(this));
  public assignEmployee = new RxFn<void, [string, WFMEmployeeAssignResp]>(this._assignEmployee.bind(this));

  private _unassignEmployee(id: string, employeeId: number): Observable<void> {
    return this.remove(`${URL}/web/v1/contracts/${id}/unassign/${employeeId}`, null, null, true);
  }

  private _deleteContract(id: string): Observable<void> {
    return this.remove(`${URL}/web/v1/contracts/${id}`, null, null, true);
  }

  private _getContracts(limit: number, offset: number): Observable<WFMContracts> {
    const params = ObjectHelper.createQueryParams({ limit, offset });
    return this.get(`${URL}/web/v1/contracts?`, WFMContractsDtoFn, null, true);
  }

  private _createContract(body: WFMContractsReq): Observable<{ id: number }> {
    return this.post(`${URL}/web/v1/contracts`, body, null, null, true);
  }

  private _getContract(id: string): Observable<WFMFullContract> {
    return this.get(`${URL}/web/v1/contracts/${id}`, WFMFullContractDtoFn, null, true);
  }

  private _changeContract(id: string, body: WFMContractsReq): Observable<void> {
    return this.put(`${URL}/web/v1/contracts/${id}`, body, null, null, true);
  }

  private _assignEmployee(id: string, body: WFMEmployeeAssignResp): Observable<void> {
    return this.post(`${URL}/web/v1/contracts/${id}/assign`, body, null, null, true);
  }
}
