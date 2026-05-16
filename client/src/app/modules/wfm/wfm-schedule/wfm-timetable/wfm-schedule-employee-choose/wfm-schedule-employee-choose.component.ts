import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { AccessControlUser } from "app/models/access-control/access-control-user";
import { AccessService } from "app/services/access.service";
import { PopupModel } from "@custom/components/popup/models/popup-model";
import { map, takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";
import { WfmScheduleService } from "app/services/wfm/wfm-schedule.service";

@Component({
  selector: "app-wfm-schedule-employee-choose",
  templateUrl: "./wfm-schedule-employee-choose.component.html",
  styleUrls: ["./wfm-schedule-employee-choose.component.scss"],
  providers: [DestroyService],
  standalone: false
})
export class WfmScheduleEmployeeChooseComponent implements OnInit {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public employeeList: AccessControlUser[] = [];
  public employeeList$: BehaviorSubject<AccessControlUser[]> = this._service.employeesList$;

  public filterValue = "";
  public dataSource: AccessControlUser[] = [];

  constructor(
    public accessService: AccessService,
    @Inject("popup") public popup: PopupModel,
    private _service: WfmScheduleService,
    private _destroy$: DestroyService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.accessService
      .getUsers()
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        this.dataSource = data;
        this._cdr.detectChanges();
      });

    this.employeeList = [...this.employeeList$.value];

    combineLatest([this.accessService.getUsers.isLoading$])
      .pipe(
        map((loading) => loading.some(Boolean)),
        takeUntil(this._destroy$)
      )
      .subscribe(this.isLoading$);

    const callback = this.popup.accept.callback;

    this.popup.accept.callback = () => {
      this._service.employeesList$.next(this.employeeList);
      callback();
    };
  }

  public onResultFn = (value: string): Observable<any> => {
    this.filterValue = value.toLowerCase();
    this.dataSource = this._applyFilter(this.accessService.getUsers.getValue());

    return of("");
  };

  public onClearSearch(): void {
    this.filterValue = null;
    this.dataSource = this._applyFilter(this.accessService.getUsers.getValue());
  }

  public isOnEmployeeList(employee: AccessControlUser): boolean {
    for (const pickedEmployee of this.employeeList) {
      if (pickedEmployee.id === employee.id) {
        return true;
      }
    }

    return false;
  }

  public onPickEmployee(e: MouseEvent, employee: AccessControlUser): void {
    e.preventDefault();
    if (!this.isOnEmployeeList(employee)) {
      this.employeeList.push(employee);
    } else {
      this.employeeList = this.employeeList.filter((item) => employee.id !== item.id);
    }
  }

  public onResetSelection(): void {
    this.employeeList = [];
  }

  private _applyFilter(data: AccessControlUser[]): AccessControlUser[] {
    if (!this.filterValue) {
      return data;
    }

    return data.filter(
      (i) =>
        i.id.toString() === this.filterValue ||
        i.name.toLowerCase().indexOf(this.filterValue) > -1 ||
        i.email.toString() === this.filterValue
    );
  }
}
