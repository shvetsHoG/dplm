import { Subject } from "rxjs";

export class Model<T> {
  refresh$: Subject<T>;
  constructor() {
    this.refresh$ = new Subject<T>();
  }
}
