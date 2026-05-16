import { Observable } from "rxjs";
import { AccessControlUser, AccessControlUsersDtoFn } from "app/models/access-control/access-control-user";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RxFn } from "rxfn";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { ServiceBase } from "@custom/common/base/service.base";

const URL = `http://localhost:3000/api`;

@Injectable({ providedIn: "root" })
export class AccessService extends ServiceBase {
  public getUsers = new RxFn<AccessControlUser[]>(this._getUsers.bind(this));
  public getUser = new RxFn<AccessControlUser>(this._getUser.bind(this));

  constructor(_http: HttpClient, _errorService: ErrorHandlerService) {
    super(_http, null, _errorService);
  }

  private _getUsers(): Observable<AccessControlUser[]> {
    return this.get<AccessControlUser[]>(`${URL}/user`, AccessControlUsersDtoFn);
  }

  private _getUser(id: string): Observable<AccessControlUser> {
    return this.get<AccessControlUser>(`${URL}/user/${id}`, AccessControlUsersDtoFn);
  }
}
