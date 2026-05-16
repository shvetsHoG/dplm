import { catchError, switchMap, tap } from "rxjs/operators";
import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { throwError } from "rxjs";
import { AuthorizationService } from "./authorization.service";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const _authService: AuthorizationService = inject(AuthorizationService);

  return next(_addTokenToRequest(request, _authService.getAccessToken())).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return _authService.getNewTokens().pipe(
          tap((resp) => _authService.saveTokenStorage(resp.accessToken)),
          switchMap((resp) => {
            return next(_addTokenToRequest(request, resp.accessToken));
          })
        );
      }

      return throwError(() => err);
    })
  );
};

const _addTokenToRequest = (request: HttpRequest<any>, token: string): HttpRequest<any> => {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
};
