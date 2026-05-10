import { UrlSegment } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { RouteModel } from "@core/models/router/route.model";

export interface RouterConfigModel {
  path: string;
  value?: string;
}

export class RouterServiceBase {
  public config: RouterConfigModel[];

  private _prevPath: BehaviorSubject<any> = new BehaviorSubject({});
  private _currentPath: BehaviorSubject<any> = new BehaviorSubject({});
  public currentPath: Observable<any> = this._currentPath.asObservable();

  public getPathChannelByName(name: string): Observable<string> {
    return this.currentPath.pipe(
      filter((data) => data[name]),
      switchMap((data) => {
        const obj = data[name];
        const valueKey = Object.keys(obj)[0];
        const value = obj[valueKey];
        return of(value);
      })
    );
  }

  public restorePath(segments: UrlSegment[]): void {
    const currentPath = {};
    for (let i = 0; i < segments.length - 1; i++) {
      const route = this.config.find((_route) => _route.path === segments[i].path);
      if (route) {
        currentPath[route.path] = {};
        if (route.value) {
          currentPath[route.path][route.value] = this._getValuePath(segments, i);
          continue;
        }
      }
    }

    this._currentPath.next(currentPath);
  }

  public setCurrentPath(path: any): void {
    this._prevPath.next(this._currentPath.getValue());
    this._currentPath.next(path);
  }

  public getCurrentPathValue(): any {
    return this._currentPath.getValue();
  }

  public getCurrentPath(): string {
    const currentPath = this._currentPath.getValue();
    return this.config.reduce((prev, route) => {
      if (currentPath[route.path]) {
        if (route.value && !currentPath[route.path][route.value]) {
          return prev;
        }

        const path = [prev, route.path];
        if (currentPath[route.path][route.value]) {
          path.push(currentPath[route.path][route.value]);
        }
        return path.join("/");
      }

      return prev;
    }, "");
  }

  public getCurrentPathCountry(): string {
    const currentPath = this._currentPath.getValue();
    let t: string;

    this.config.reduce((prev, route) => {
      if (currentPath[route.path]) {
        if (route.value && !currentPath[route.path][route.value]) {
          return prev;
        }

        if (route.path === "COUNTRY") {
          t = currentPath[route.path][route.value];
        }
        return [];
      }

      return prev;
    }, "");
    return t;
  }

  public navigateTo(routes: RouteModel): string {
    const currentPath = this._currentPath.getValue();
    this._prevPath.next(Object.assign({}, currentPath));

    for (const route in routes) {
      if (routes.hasOwnProperty(route)) {
        const currentRoute = this.config.find((_route) => _route.path === route);
        if (currentRoute) {
          currentPath[currentRoute.path] = {};
          if (currentRoute.value) {
            currentPath[currentRoute.path][currentRoute.value] = routes[route];
            continue;
          }
        }
      }
    }

    this._currentPath.next(currentPath);
    return this.getCurrentPath();
  }

  public getValuePath(path: string): any {
    const currentPath = this._currentPath.getValue();
    return this._getPath(currentPath, path);
  }

  public getPrevValuePath(path: string): any {
    const prevPath = this._prevPath.getValue();
    return this._getPath(prevPath, path);
  }

  public wasUpdateValuePath(path: string): boolean {
    return this.getValuePath(path) !== this.getPrevValuePath(path);
  }

  private _getPath(targetPath: any, path: string): any {
    const route = this.config.find((item) => item.path === path);
    if (!route) {
      return;
    }

    const obj = targetPath[route.path];
    return obj ? obj[route.value] : undefined;
  }

  private _getValuePath(arr: UrlSegment[], index: number): string {
    return arr[index + 1].path;
  }
}
