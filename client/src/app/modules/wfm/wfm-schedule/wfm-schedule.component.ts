import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from "@angular/core";
import { DestroyService } from "app/services/destroy.service";
import { WfmRouterPaths } from "app/models/wfm/wfm";
import { NavigationService } from "app/services/navigation-service";
import { takeUntil, tap } from "rxjs/operators";

enum PATHS {
  TIMETABLE = "Расписание",
  CONTRACTS = "Контракты"
}

const PATH_VARIABLES: Record<PATHS, string> = {
  [PATHS.TIMETABLE]: "timetable",
  [PATHS.CONTRACTS]: "contracts"
};

@Component({
  selector: "app-wfm-schedule",
  templateUrl: "./wfm-schedule.component.html",
  styleUrls: ["./wfm-schedule.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  standalone: false
})
export class WfmScheduleComponent implements OnInit {
  public readonly tabs = [PATHS.TIMETABLE, PATHS.CONTRACTS];
  public readonly paths = PATHS;
  public readonly pathVariables = PATH_VARIABLES;

  public path: WritableSignal<string> = signal(null);
  public contractId: WritableSignal<string> = signal(null);

  readonly routerPaths = WfmRouterPaths;

  constructor(
    private _destroy$: DestroyService,
    private _navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // this._navigationService
    //   .getPathChannelByName(WfmContractsRouterType.path)
    //   .pipe(takeUntil(this._destroy$))
    //   .subscribe((path) => (this.routerPath = path));
    //
    // this._navigationService
    //   .getPathChannelByName(WfmContractsRouterType.id)
    //   .pipe(takeUntil(this._destroy$))
    //   .subscribe((id) => (this.contractId = id));

    this._navigationService.url$
      .pipe(
        tap((items) => {
          if (items.length === 3 && items[1] === "id") {
            this.contractId.set(items[2]);
          }
        }),
        takeUntil(this._destroy$)
      )
      .subscribe((items) => this.path.set(items[0]));
  }

  public setPath(path: PATHS): void {
    this._navigationService.navigate(PATH_VARIABLES[path]);
  }

  public;
}
