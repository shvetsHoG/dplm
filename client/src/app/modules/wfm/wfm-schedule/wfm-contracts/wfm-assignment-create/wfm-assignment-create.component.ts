import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, merge, Observable, of } from "rxjs";
import { AccessControlUsers } from "app/models/access-control/access-control-users";
import { AccessService } from "app/services/access.service";
import { map, take, takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";
import { WfmContractsService } from "app/services/wfm/wfm-contracts.service";
import { PopupModel } from "@custom/components/popup/models/popup-model";
import { WFMEmployeeAssignResp } from "app/models/wfm/wfm-contracts";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";

@Component({
  selector: "app-wfm-assignment-create",
  templateUrl: "./wfm-assignment-create.component.html",
  styleUrls: ["./wfm-assignment-create.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  standalone: false
})
export class WfmAssignmentCreateComponent implements OnInit {
  public employeeGroup$: BehaviorSubject<{ fullname: string; id: number }[]> = new BehaviorSubject<
    { fullname: string; id: number }[]
  >([]);
  public filterValue = "";
  public dataSource: AccessControlUsers[] = [];
  public pickedEmployees: AccessControlUsers[] = [];
  public employeesList: AccessControlUsers[] = [];
  public contractId: string = null;

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    @Inject("popup") public popup: PopupModel,
    public accessService: AccessService,
    private _contractService: WfmContractsService,
    private _cdr: ChangeDetectorRef,
    private _destroy$: DestroyService,
    private _errorService: ErrorHandlerService
  ) {
    this.contractId = this.popup.data.contractId;
    this.employeeGroup$.next(this.popup.data.employeeGroup);
  }

  ngOnInit(): void {
    this.accessService
      .getUsers(null, null, null)
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        this.dataSource = data;
        this._cdr.detectChanges();
      });

    this._contractService.getContract.store$.pipe(takeUntil(this._destroy$)).subscribe((contract) => {
      this.employeeGroup$.next(contract.employeeGroups[0]?.employees);
    });

    combineLatest([
      this.accessService.getUsers.isLoading$,
      this._contractService.getContract.isLoading$,
      this._contractService.assignEmployee.isLoading$,
      this._contractService.unassignEmployee.isLoading$
    ])
      .pipe(
        map((loading) => loading.some(Boolean)),
        takeUntil(this._destroy$)
      )
      .subscribe(this.isLoading$);

    this.employeeGroup$.pipe(takeUntil(this._destroy$)).subscribe((employeeGroup) => {
      this.pickedEmployees =
        employeeGroup?.map(
          (employee) =>
            ({
              id: employee.id,
              name: employee.fullname,
              email: null,
              roleIds: [],
              groupIds: []
            }) as AccessControlUsers
        ) || [];

      if (this.employeesList.length === 0) {
        this.employeesList = [...this.pickedEmployees];
      }
    });

    merge(
      this._contractService.getContract.errorHandler$,
      this._contractService.assignEmployee.errorHandler$,
      this._contractService.unassignEmployee.errorHandler$
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe((err) => {
        if (err?.error?.error) {
          const headers = err.headers;
          const customHeader = headers.get("X-Request-Id");

          const errBody = { message: `${err?.url} \n ${err?.error?.error} \n Request ID: ${customHeader}` };
          this._errorService.showError(errBody);
        }
      });
  }

  public onResultFn = (value: string): Observable<any> => {
    this.filterValue = value.toLowerCase();
    this.dataSource = this._applyFilter(this.accessService.getUsers.getValue());

    this._cdr.detectChanges();
    return of("");
  };

  public onClearSearch(): void {
    this.filterValue = null;
    this.dataSource = this._applyFilter(this.accessService.getUsers.getValue());
  }

  public onPickEmployee(e: MouseEvent, employee: AccessControlUsers) {
    // TODO: неадекватное поведение чекбокса, 2 клика
    e.preventDefault();
    if (!this.isOnEmployeeList(employee)) {
      this.employeesList.push(employee);
    } else {
      this.employeesList = this.employeesList.filter((item) => employee.id !== item.id);
    }
  }

  public onAssignEmployee(e: MouseEvent, employee: AccessControlUsers) {
    e.preventDefault();
    if (!this.isPicked(employee)) {
      this._contractService.assignEmployee.setParams(this.contractId, {
        employee: {
          fullname: employee.name,
          id: employee.id
        },
        team: {
          externalId: null,
          name: null
        }
      } as WFMEmployeeAssignResp);

      this._contractService.assignEmployee.get$.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
        this.pickedEmployees.push(employee);
        this._cdr.detectChanges();
      });
    } else {
      this._contractService.unassignEmployee.setParams(this.contractId, employee.id.toString());

      this._contractService.unassignEmployee.get$.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
        this.pickedEmployees = this.pickedEmployees.filter((item) => employee.id !== item.id);
        this._cdr.detectChanges();
      });
    }
  }

  public isPicked(employee: AccessControlUsers) {
    for (const pickedEmployee of this.pickedEmployees) {
      if (pickedEmployee.id === employee.id) {
        return true;
      }
    }

    return false;
  }

  public isOnEmployeeList(employee: AccessControlUsers) {
    for (const pickedEmployee of this.employeesList) {
      if (pickedEmployee.id === employee.id) {
        return true;
      }
    }

    return false;
  }

  private _applyFilter(data: AccessControlUsers[]): AccessControlUsers[] {
    if (!this.filterValue) {
      return data;
    }

    return data.filter(
      (i: any) =>
        i.id.toString() === this.filterValue ||
        i.name.toLowerCase().indexOf(this.filterValue) > -1 ||
        i.email.toString() === this.filterValue
    );
  }
}
