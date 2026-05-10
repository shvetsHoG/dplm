import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { CoreModule } from "app/@core/core-module";
import { CustomModule } from "@custom/custom-module";
import { CommonModule } from "@angular/common";
import { WfmScheduleModule } from "app/modules/wfm/wfm-schedule/wfm-schedule.module";
import { ViewContainerService } from "@core/services/view-container.service";
import { ToastService } from "@custom/common/services/toast.service";

@Component({
  selector: "app-root",
  imports: [CoreModule, CustomModule, CommonModule, WfmScheduleModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit {
  @ViewChild("toast", { static: true }) toast: TemplateRef<any>;

  constructor(
    private _viewContainerService: ViewContainerService,
    private vcr: ViewContainerRef,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this._viewContainerService.setViewContainerRef(this.vcr);
    this._emitOfflineToast();
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
