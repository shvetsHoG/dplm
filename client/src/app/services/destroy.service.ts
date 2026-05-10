import { Injectable, OnDestroy } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable()
export class DestroyService extends ReplaySubject<void> implements OnDestroy {
  constructor() {
    super();
  }

  ngOnDestroy() {
    this.next(null);
    this.complete();
  }
}
