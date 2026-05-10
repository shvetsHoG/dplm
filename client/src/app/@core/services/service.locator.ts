import { Inject, Injector, Injectable, StaticProvider } from "@angular/core";

@Injectable()
export class ServiceLocator {
  static injector: Injector;

  constructor(
    @Inject("locateProviders") protected locateProviders: StaticProvider[],
    protected injector: Injector
  ) {
    ServiceLocator.injector = Injector.create({
      providers: locateProviders,
      parent: injector
    });
  }
}
