import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CoreModule } from "app/@core/core-module";
import { SharedModule } from "./shared/shared-module";
import { CustomModule } from "@custom/custom-module";
import { CommonModule } from "@angular/common";
import { WfmScheduleModule } from "app/modules/wfm/wfm-schedule/wfm-schedule.module";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CoreModule, SharedModule, CustomModule, CommonModule, WfmScheduleModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent {
  protected readonly title = signal("client");
}
