import { Injectable } from "@angular/core";
import { ServiceBase } from "@custom/common/base/service.base";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { AuthForm, AuthResponse } from "app/models/authorization/authorization";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

export enum EnumTokens {
  "ACCESS_TOKEN" = "accessToken",
  "REFRESH_TOKEN" = "refreshToken"
}

const URL = `http://localhost:3000/api`;

@Injectable({ providedIn: "root" })
export class AuthorizationService extends ServiceBase {
  constructor(_http: HttpClient, _errorService: ErrorHandlerService) {
    super(_http, null, _errorService);
  }

  public authorize(type: "login" | "registration", data: AuthForm) {
    this._auth(type, data).pipe(
      tap((data) => {
        if (data.accessToken) {
          this.saveTokenStorage(data.accessToken);
        }
      })
    );
  }

  public getNewTokens(): Observable<AuthResponse> {
    return this.post<AuthResponse>(`${URL}/auth/login/access-token`, null).pipe(
      tap((data) => {
        if (data.accessToken) {
          this.saveTokenStorage(data.accessToken);
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

  public removeFromStorage(): void {
    localStorage.removeItem(EnumTokens.ACCESS_TOKEN);
  }

  private _logout(): Observable<boolean> {
    return this.post<boolean>(`${URL}/auth/logout`, null);
  }

  private _auth(type: "login" | "registration", data: AuthForm): Observable<AuthResponse> {
    return this.post<AuthResponse>(`/auth/${type}`, data);
  }
}
