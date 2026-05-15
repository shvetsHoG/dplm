import { Observable } from "rxjs";
import { AccessControlUsers, AccessControlUsersDtoFn } from "app/models/access-control/access-control-users";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RxFn } from "rxfn";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { ServiceBase } from "@custom/common/base/service.base";

const URL = `http://localhost:3000/api`;

@Injectable({ providedIn: "root" })
export class AccessService extends ServiceBase {
  public getUsers = new RxFn<AccessControlUsers[]>(this._getUsers.bind(this));
  public getUser = new RxFn<AccessControlUsers>(this._getUser.bind(this));

  constructor(_http: HttpClient, _errorService: ErrorHandlerService) {
    super(_http, null, _errorService);
  }

  private _getUsers(): Observable<AccessControlUsers[]> {
    return this.get<AccessControlUsers[]>(`${URL}/user`, AccessControlUsersDtoFn);
  }

  private _getUser(id: string): Observable<AccessControlUsers> {
    return this.get<AccessControlUsers>(`${URL}/user/${id}`, AccessControlUsersDtoFn);
  }
}
