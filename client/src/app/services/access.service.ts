import { Observable } from "rxjs";
import { AccessControlUsers, AccessControlUsersDtoFn } from "app/models/access-control/access-control-users";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RxFn } from "rxfn";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { ServiceBase } from "@custom/common/base/service.base";

const URL = `/api/role/`;

@Injectable()
export class AccessService extends ServiceBase {
  public getUsers = new RxFn<AccessControlUsers[], [string[], number[], number[]]>(this._getUsers.bind(this));

  constructor(_http: HttpClient, _errorService: ErrorHandlerService) {
    super(_http, null, _errorService);
  }

  private _getUsers(groupIds: string[], themeIds: number[], levelIds: number[]): Observable<AccessControlUsers[]> {
    const body = {
      group_ids: groupIds,
      theme_ids: themeIds,
      level_ids: levelIds
    };
    return this.post<AccessControlUsers[]>(`${URL}`, body, AccessControlUsersDtoFn);
  }
}
