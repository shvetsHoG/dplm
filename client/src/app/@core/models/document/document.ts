import { DocumentInitializer, IDocumentInitializer } from "./document.initializer";
import { ViewRef } from "@angular/core";

export class AppDocument {
  public initializer: DocumentInitializer;
  public selected: boolean;
  public nameToSearch: string;
  public viewRef: ViewRef;

  constructor(initializer: IDocumentInitializer) {
    this.initializer = new DocumentInitializer(
      initializer.name,
      initializer.key,
      initializer.parentKey,
      initializer.type,
      initializer.controller,
      initializer.meta,
      initializer.role,
      null,
      null,
      initializer.lazyLoad,
      initializer.injector,
      initializer.isPin,
      initializer.reportName,
      initializer.serviceUrl
    );

    this.nameToSearch = this.initializer
      ? this.initializer.meta && this.initializer.meta.name
        ? this.initializer.name + this.initializer.meta.name
        : this.initializer.name
      : null;
  }
}
