import { Component, OnInit, signal, TemplateRef, ViewChild, ViewContainerRef, WritableSignal } from "@angular/core";
import { CoreModule } from "app/@core/core-module";
import { CustomModule } from "@custom/custom-module";
import { CommonModule } from "@angular/common";
import { WfmScheduleModule } from "app/modules/wfm/wfm-schedule/wfm-schedule.module";
import { ViewContainerService } from "@core/services/view-container.service";
import { ToastService } from "@custom/common/services/toast.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter, take, takeUntil } from "rxjs/operators";
import { RegistrationModule } from "app/modules/registration/registration-module";
import { LoginModule } from "app/modules/login/login-module";
import { NavigationService } from "app/services/navigation-service";
import { AuthorizationService } from "app/services/authorization/authorization.service";
import { DestroyService } from "app/services/destroy.service";

@Component({
  selector: "app-root",
  imports: [CoreModule, CustomModule, CommonModule, WfmScheduleModule, RegistrationModule, LoginModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DestroyService]
})
export class AppComponent implements OnInit {
  @ViewChild("toast", { static: true }) toast: TemplateRef<any>;
  public isAuth: WritableSignal<boolean> = this._authService.isAuth;
  public isReg: WritableSignal<boolean> = signal(false);

  constructor(
    private _viewContainerService: ViewContainerService,
    private vcr: ViewContainerRef,
    private toastService: ToastService,
    private _router: Router,
    private _authService: AuthorizationService,
    private _navigationService: NavigationService,
    private _destroy$: DestroyService
  ) {}

  ngOnInit() {
    this._viewContainerService.setViewContainerRef(this.vcr);
    this._emitOfflineToast();
    this._authService.getNewTokens().pipe(takeUntil(this._destroy$), take(1)).subscribe();

    this._router.events
      .pipe(
        filter((data) => data instanceof NavigationEnd),
        take(1)
      )
      .subscribe((e: NavigationEnd) => {
        if (!"/registration".includes(e.url) && !this.isAuth()) {
          this._navigationService.goToLogin();
        }
        if ("/registration".includes(e.url) && !this.isAuth()) {
          this.isReg.set(true);
          return;
        }
        if ("/registration".includes(e.url) && this.isAuth()) {
          this._router.navigate(["timetable"]);
          this.isReg.set(false);
        }

        this.isReg.set(false);
      });
  }

  private _emitOfflineToast(): void {
    window.addEventListener("offline", (e) => {
      this.toastService.show({
        contentTemplate: this.toast,
        key: "KeyR",
        timeout: null
      });
    });

    window.addEventListener("online", (e) => {
      this.toastService.hide("KeyR");
    });
  }
}
