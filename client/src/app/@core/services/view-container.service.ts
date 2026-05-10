import { Injectable, ViewContainerRef } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ViewContainerService {
  public vcr: ViewContainerRef;

  constructor() { }

  public setViewContainerRef(vcr: ViewContainerRef): void {
    this.vcr = vcr;
  }
}
