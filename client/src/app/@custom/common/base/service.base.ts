import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService, ErrorModel } from "@custom/common/services/error-handler.service";
import { AppDocument } from "@core/models/document/document";

export class ServiceBase {
  constructor(
    protected http: HttpClient,
    protected apiUrl: string,
    protected errorService: ErrorHandlerService,
    protected document?: AppDocument
  ) {}

  protected get<T>(
    url: string,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any),
    getAllResponse?: boolean
  ): Observable<T> {
    return this.processRequest("get", url, null, onWrap, options, noError, getAllResponse);
  }

  protected post<T>(
    url: string,
    body: any,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any),
    getAllResponse?: boolean
  ): Observable<T> {
    return this.processRequest("post", url, body, onWrap, options, noError, getAllResponse);
  }

  protected head<T>(
    url: string,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any)
  ): Observable<T> {
    return this.processRequest("head", url, null, onWrap, options, noError);
  }

  protected put<T>(
    url: string,
    body: any,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any)
  ): Observable<T> {
    return this.processRequest("put", url, body, onWrap, options, noError);
  }

  protected patch<T>(
    url: string,
    body: any,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any)
  ): Observable<T> {
    return this.processRequest("patch", url, body, onWrap, options, noError);
  }

  protected remove<T>(
    url: string,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any)
  ): Observable<T> {
    return this.processRequest("remove", url, null, onWrap, options, noError);
  }

  private processRequest<T>(
    method: "post" | "get" | "put" | "patch" | "remove" | "head",
    url: string,
    body: any,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any),
    getAllResponse?: boolean
  ): Observable<T> {
    const _noError = noError;
    const fn = this._getMethodFunction<T>(method, url, options || {}, body);
    const observable = this.getMiddleObservable<T>(fn, onWrap, _noError, method, body, getAllResponse);
    return observable;
  }

  private getMiddleObservable<T>(
    fn: Observable<any>,
    onWrap?: (any) => any,
    noError?: boolean | ((err: any) => any),
    method?: "post" | "get" | "put" | "patch" | "remove" | "head",
    body?: any,
    getAllResponse?: boolean
  ): Observable<T> {
    return fn.pipe(
      catchError((rejected: any) => {
        let message = "";
        if (typeof noError === "function") {
          const result = noError(rejected);
          if (result) {
            return result;
          }
        }

        if (rejected && rejected.error) {
          message = `${rejected.url}`;
          if (rejected.status === 0) {
            message += `\nНеизвестная ошибка`;
          } else if (typeof rejected.error === "string") {
            message += `\n${rejected.error}`;
          } else {
            message += `\n${
              rejected.error.message || rejected.error.Message || rejected.error.error || rejected.message
            }`;

            if (rejected.error.operator_error) {
              message = rejected.error.operator_error;
            }
          }

          this.processError(message, noError, rejected, method, body);
        } else if (rejected) {
          message = rejected.message;
          this.processError(message, noError, rejected, method, body);
        } else {
          message = "Произошла одна или несколько ошибок";
          this.processError(message, noError, rejected, method, body);
        }
        return throwError(rejected);
      }),
      tap((response) => {
        this.check(response, noError);
        return response;
      }),
      map((response) => {
        if (response === null) {
          return response;
        }
        if (response.hasOwnProperty("result") && response.hasOwnProperty("error_description")) {
          return response;
        }
        if (response.hasOwnProperty("result") && !getAllResponse) {
          if (response.result === null) {
            response.result = [];
          }
          if (!response.result) {
            response = null;
          } else {
            response = response.result;
          }
        }
        if (response.hasOwnProperty("data") && response.hasOwnProperty("error_description")) {
          return response;
        }
        if (response.hasOwnProperty("data")) {
          if (response.data === null) {
            response.data = [];
          }
          if (!response.data && !response.hasOwnProperty("total")) {
            response = null;
            return;
          }
          if (response.hasOwnProperty("status")) {
            response = response;
          }
          if (response.hasOwnProperty("total")) {
            response = response;
          }
          if (!response.hasOwnProperty("status") && !response.hasOwnProperty("total") && !getAllResponse) {
            response = response.data;
          }
        }
        if (onWrap && response) {
          if (Array.isArray(response)) {
            return response.map(onWrap);
          } else {
            try {
              return onWrap(response);
            } catch (e) {
              this.processError(e.message, noError, null, null, null);
            }
          }
        }
        return response;
      })
    );
  }

  private check(response, noError) {
    if (response && !response.is_ok && response.hasOwnProperty("is_ok")) {
      this.processError(response.message, noError, null, null, null);
      return null;
    }
    return response;
  }

  private processError(
    message: string,
    noError: boolean | ((err: any) => any),
    rejected: any,
    method: "post" | "get" | "put" | "patch" | "remove" | "head",
    body: any
  ) {
    if (this.document?.viewRef?.destroyed) {
      return;
    }

    if (typeof noError === "boolean" && noError) {
      return;
    }

    let request = "";

    if (rejected.error) {
      request += "Method: " + method;
    }

    if (body) {
      request += "\n Body - " + JSON.stringify(body);
    }

    let response = "";

    if (rejected.error) {
      response += JSON.stringify(rejected.error);
    }

    if (rejected.status) {
      response += "\n Status - " + JSON.stringify(rejected.status);
    }

    if (rejected.url) {
      response += "\n URL - " + JSON.stringify(rejected.url);
    }

    const err: ErrorModel = {
      date: new Date(),
      request: request,
      response: response,
      url: rejected?.url,
      message: message
    };

    this.errorService.showError(err, this.document?.viewRef);
  }

  private _getMethodFunction<T>(type: string, url: string, options: any, body?: any) {
    const baseUrl = url;
    const apiUrl = this.apiUrl ? this.apiUrl + baseUrl : baseUrl;

    switch (type) {
      case "post":
        return this.http.post<T>(apiUrl, body, options);
      case "get":
        return this.http.get<T>(apiUrl, options);
      case "put":
        return this.http.put<T>(apiUrl, body, options);
      case "patch":
        return this.http.patch<T>(apiUrl, body, options);
      case "head":
        return this.http.head<T>(apiUrl, options);
      case "remove":
        return this.http.delete<T>(apiUrl, options);
    }
  }
}
