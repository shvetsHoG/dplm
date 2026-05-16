import { Injectable, signal, WritableSignal } from "@angular/core";
import { ServiceBase } from "@custom/common/base/service.base";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { AuthForm, AuthResponse } from "app/models/authorization/authorization";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AccessControlUser } from "app/models/access-control/access-control-user";

export enum EnumTokens {
  "ACCESS_TOKEN" = "accessToken",
  "REFRESH_TOKEN" = "refreshToken"
}

const URL = `http://localhost:3000/api`;

@Injectable({ providedIn: "root" })
export class AuthorizationService extends ServiceBase {
  public isAuth: WritableSignal<boolean> = signal<boolean>(false);
  public user: WritableSignal<AccessControlUser> = signal<AccessControlUser>(null);

  constructor(_http: HttpClient, _errorService: ErrorHandlerService) {
    super(_http, null, _errorService);
  }

  public authorize(type: "login" | "registration", data: AuthForm) {
    return this._auth(type, data).pipe(
      tap((data: AuthResponse) => {
        if (data.accessToken) {
          this.setAuth(data);
        }
        return data;
      })
    );
  }

  public getNewTokens(): Observable<AuthResponse> {
    return this.post<AuthResponse>(`${URL}/auth/login/access-token`, null).pipe(
      tap((data: AuthResponse) => {
        if (data.accessToken) {
          this.setAuth(data);
        }
        return data;
      })
    );
  }

  public getAccessToken(): string {
    const accessToken = localStorage.getItem(EnumTokens.ACCESS_TOKEN);
    return accessToken || null;
  }

  public saveTokenStorage(accessToken: string): void {
    localStorage.setItem(EnumTokens.ACCESS_TOKEN, accessToken);
  }

  public setAuth(data: AuthResponse): void {
    this.isAuth.set(true);
    this.user.set(data.user);
    this.saveTokenStorage(data.accessToken);
  }

  public logout(): Observable<boolean> {
    return this.post<boolean>(`${URL}/auth/logout`, null).pipe(tap(() => this._removeFromStorage()));
  }

  private _removeFromStorage(): void {
    localStorage.removeItem(EnumTokens.ACCESS_TOKEN);
  }

  private _auth(type: "login" | "registration", data: AuthForm): Observable<AuthResponse> {
    return this.post<AuthResponse>(`${URL}/auth/${type}`, data);
  }
}
