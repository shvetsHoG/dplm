import { Injectable } from "@angular/core";
import { ServiceBase } from "@custom/common/base/service.base";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { RxFn } from "../../../rxfn";
import { BehaviorSubject, Observable } from "rxjs";
import { WfmEmployeesEventReq, WfmItems, WfmItemsDtoFn } from "app/models/wfm/wfm-schedule";
import { AccessControlUsers } from "app/models/access-control/access-control-users";
import { ObjectHelper } from "@custom/extensions/object-helper.extensions";

const URL = `api/wfm`;

@Injectable()
export class WfmScheduleService extends ServiceBase {
  constructor(_http: HttpClient, _errorService: ErrorHandlerService) {
    super(_http, null, _errorService);
  }

  public employeesList$: BehaviorSubject<AccessControlUsers[]> = new BehaviorSubject<AccessControlUsers[]>([]);

  public getEvents = new RxFn<WfmItems, [string, string, string, number?, number?]>(this._getEvents.bind(this));
  public createEvent = new RxFn<{ id: number }, [number, WfmEmployeesEventReq]>(this._createEvent.bind(this));
  public changeEvent = new RxFn<void, [number, WfmEmployeesEventReq]>(this._changeEvent.bind(this));
  public deleteEvent = new RxFn<void, [number, number]>(this._deleteEvent.bind(this));

  private _getEvents(
    startDate: string,
    endDate: string,
    employeeIds: string,
    limit?: number,
    offset?: number
  ): Observable<WfmItems> {
    const params = ObjectHelper.createQueryParams({
      start_date: startDate,
      end_date: endDate,
      employee_ids: employeeIds,
      limit,
      offset
    });
    return this.get(`${URL}/web/v1/employees/calendar?${params}`, WfmItemsDtoFn);
  }

  private _createEvent(employeeId: number, body: WfmEmployeesEventReq): Observable<{ id: number }> {
    return this.post(`${URL}/web/v1/employees/${employeeId}/events`, body);
  }

  private _changeEvent(eventId: number, body: WfmEmployeesEventReq): Observable<void> {
    return this.put(`${URL}/web/v1/events/${eventId}`, body);
  }

  private _deleteEvent(employeeId: number, eventId: number): Observable<void> {
    return this.remove(`${URL}/web/v1/employees/${employeeId}/events/${eventId}`);
  }
}
