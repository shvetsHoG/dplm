import { RouterOutlet } from "@angular/router";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [RouterOutlet],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}
