import { Observable } from "rxjs";

export interface DelayedObservable {
  obs: Observable<any>;
  store: any[];
  stop: () => void;
}
