import { Injectable } from "@angular/core";
import { takeUntil, share } from "rxjs/operators";
import { Observable, Subject, timer, Subscriber } from "rxjs";

@Injectable()
export class TimeIntervalService {
  private _intervalsDictionary: { [period: number]: Observable<number> } = {};
  private _countSubscriptionsDictionary: { [period: number]: number } = {};

  constructor() { }

  public getInterval(period: number, due: number): Observable<number> {
    if (this._intervalsDictionary[period]) {
      return this._intervalsDictionary[period];
    }
    this._countSubscriptionsDictionary[period] = 0;
    this._intervalsDictionary[period] = this._subscriberCount(period, due);
    return this._intervalsDictionary[period];
  }

  private _subscriberCount(period: number, due: number): Observable<number> {
    const stopInterval$: Subject<void> = new Subject();
    const timer$ = timer(due, period).pipe(share(), takeUntil(stopInterval$));

    return new Observable((subscriber: Subscriber<number>) => {
      const subscription = timer$.subscribe(subscriber);
      this._countSubscriptionsDictionary[period]++;
      return () => {
        subscription.unsubscribe();
        this._countSubscriptionsDictionary[period]--;
        if (this._countSubscriptionsDictionary[period] === 0) {
          stopInterval$.next(null);
          stopInterval$.complete();
        }
      };
    });
  }
}
