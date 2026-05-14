import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class NavigationService {
  private _urlSubj$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(window.location.pathname.split("/"));
  public url$: Observable<string[]> = this._urlSubj$.asObservable().pipe(map((items) => items.filter(Boolean)));

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.trackUrlChanges();
  }

  private trackUrlChanges() {
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this._urlSubj$.next(window.location.pathname.split("/"));
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this._urlSubj$.next(window.location.pathname.split("/"));
    };

    window.addEventListener("popstate", () => {
      this._urlSubj$.next(window.location.pathname.split("/"));
    });
  }

  public navigate(path: string, params?: NavigationExtras): void {
    this._router.navigate([path], params ?? { queryParams: this._activatedRoute?.snapshot?.queryParams });
  }

  public goToLogin(): void {
    if (this._router.navigated) {
      return this._navigateToLogin();
    }
  }

  private _navigateToLogin(): void {
    if (this._activatedRoute?.snapshot?.queryParams?.state) {
      this._router.navigate(["LOGIN"], { queryParams: this._activatedRoute?.snapshot?.queryParams });
      return;
    }

    this._router.navigate(["LOGIN"]);
  }
}
