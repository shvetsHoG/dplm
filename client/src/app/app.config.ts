import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideTranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { authInterceptor } from "app/services/authorization/interceptor.service";

const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, "./assets/i18n/", ".json");

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTranslateService({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
