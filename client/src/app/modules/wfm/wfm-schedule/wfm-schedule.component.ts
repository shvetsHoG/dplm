import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DestroyService } from "app/services/destroy.service";
import { WfmRouterPaths } from "app/models/wfm/wfm";

@Component({
  selector: "app-wfm-schedule",
  templateUrl: "./wfm-schedule.component.html",
  styleUrls: ["./wfm-schedule.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  standalone: false
})
export class WfmScheduleComponent implements OnInit {
  public path = "";
  public contractId = "";

  readonly routerPaths = WfmRouterPaths;

  constructor(private _destroy$: DestroyService) {}

  ngOnInit(): void {}
}
