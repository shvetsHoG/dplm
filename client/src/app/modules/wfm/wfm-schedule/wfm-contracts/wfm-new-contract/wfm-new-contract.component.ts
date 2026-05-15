import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { shiftType, WeekDayType, WfmRouterPaths } from "app/models/wfm/wfm";
import { WfmDictService } from "app/services/wfm/wfm-dict.service";
import { BehaviorSubject, combineLatest, merge, Observable, of } from "rxjs";
import { WfmContractType, WfmWeekDay } from "app/models/wfm/wfm-dict";
import { DestroyService } from "app/services/destroy.service";
import { concatMap, filter, map, take, takeUntil } from "rxjs/operators";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { FormComponentBase } from "@custom/common/base/form.component.base";
import { WfmContractsService } from "app/services/wfm/wfm-contracts.service";
import { WFMContractsReq, WFMEmployeeGroup } from "app/models/wfm/wfm-contracts";
import { PopupService } from "@custom/components/popup/popup.service";
import { WfmAssignmentCreateComponent } from "app/modules/wfm/wfm-schedule/wfm-contracts/wfm-assignment-create/wfm-assignment-create.component";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";
import { NavigationService } from "app/services/navigation-service";

@Component({
  selector: "app-wfm-new-contract",
  templateUrl: "./wfm-new-contract.component.html",
  styleUrls: ["./wfm-new-contract.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  standalone: false
})
export class WfmNewContractComponent extends FormComponentBase implements OnInit {
  @Input() contractId: string = null;

  weekDays$: BehaviorSubject<WfmWeekDay[]> = new BehaviorSubject([]);
  contractTypes$: BehaviorSubject<WfmContractType[]> = new BehaviorSubject([]);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isFiveDays$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  formGroup: FormGroup;
  filterValue = "";
  contractName: string;
  employeeGroup: WFMEmployeeGroup;
  sortedEmployees: { fullname: string; id: number }[];

  constructor(
    private _popup: PopupService,
    private _contractService: WfmContractsService,
    private _dictService: WfmDictService,
    private _destroy$: DestroyService,
    private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _errorService: ErrorHandlerService,
    private _navigationService: NavigationService
  ) {
    super();
    this.formGroup = this._fb.group({
      name: ["", [Validators.required, Validators.minLength(1)]],
      duration: [8, [Validators.required, Validators.min(1), Validators.max(24)]],
      schedule: [this.contractTypes$.value[0], [Validators.required]],
      customDays: [this.weekDays$.value, [this._createCustomDaysValidator()]],
      startDate: [new Date(), [Validators.required]],
      startTime: [new Date().setHours(0, 0, 0, 0), [Validators.required]]
    });
  }

  ngOnInit(): void {
    combineLatest([this._dictService.getWeekDays(), this._dictService.getContractTypes()])
      .pipe(
        filter(() => this.contractId !== null),
        concatMap(() => this._contractService.getContract(this.contractId)),
        takeUntil(this._destroy$)
      )
      .subscribe();

    combineLatest([
      this._dictService.getWeekDays.isLoading$,
      this._dictService.getContractTypes.isLoading$,
      this._contractService.getContract.isLoading$,
      this._contractService.createContract.isLoading$,
      this._contractService.updateContract.isLoading$,
      this._contractService.unassignEmployee.isLoading$
    ])
      .pipe(
        map((loading) => loading.some(Boolean)),
        takeUntil(this._destroy$)
      )
      .subscribe(this.isLoading$);

    merge(
      this._dictService.getWeekDays.errorHandler$,
      this._dictService.getContractTypes.errorHandler$,
      this._contractService.getContract.errorHandler$,
      this._contractService.createContract.errorHandler$,
      this._contractService.updateContract.errorHandler$,
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

    this._dictService.getWeekDays.store$.pipe(takeUntil(this._destroy$)).subscribe((data) => {
      this.weekDays$.next(data);
      if (!this.contractId && !this._contractService.getContract.getValue()?.shift.customDays) {
        this.formGroup.get("customDays").setValue(data);
        this.formGroup.get("customDays").markAsPristine();
      }
    });

    this._dictService.getContractTypes.store$.pipe(takeUntil(this._destroy$)).subscribe((data) => {
      this.contractTypes$.next(data);
      if (!this.contractId && !this._contractService.getContract.getValue()?.shift.type) {
        this.formGroup.get("schedule").setValue(data);
        this.formGroup.get("schedule").markAsPristine();
      }
    });

    this._contractService.getContract.store$.pipe(takeUntil(this._destroy$)).subscribe((contract) => {
      this.contractName = contract.name;
      this.employeeGroup = contract.employeeGroups[0]; // TODO: будет исправлено после исправления ручки на бэке
      this.sortedEmployees = contract.employeeGroups[0]?.employees;

      if (contract.shift.customDays?.length > 0) {
        const customDays: WfmWeekDay[] = [];
        contract.shift.customDays.forEach((weekDay) => {
          const day = this.weekDays$.value.find((customDay) => customDay.number === weekDay.weeknumber);
          customDays.push({ ...day, number: weekDay.weeknumber, type: weekDay.type });
        });

        this.weekDays$.next(customDays);
        this.formGroup.get("customDays").setValue(customDays);
      } else {
        this.formGroup.get("customDays").setValue(this.weekDays$.value);
      }

      this.formGroup.get("name").setValue(contract.name);
      this.formGroup.get("duration").setValue(contract.shift.duration);
      this.formGroup.get("schedule").setValue({
        id: contract.shift.id,
        type: contract.shift.type,
        name: `${contract.shift.type === shiftType.CUSTOM_DAYS ? "5/2" : "2/2"}`
      } as WfmContractType);
      this.formGroup.get("startDate").setValue(new Date(contract.shift.startDate || new Date()).withoutTimezone());
      this.formGroup.get("startTime").setValue(new Date(contract.shift.startTime).withoutTimezone());
    });

    this.isFiveDays$.pipe(takeUntil(this._destroy$)).subscribe((isFiveDays) => {
      if (isFiveDays) {
        this.formGroup.get("startDate").clearValidators();
        this.formGroup.get("customDays").setValidators([this._createCustomDaysValidator()]);
      } else {
        this.formGroup.get("customDays").clearValidators();
        this.formGroup.get("customDays").setErrors(null);
        this.formGroup.get("startDate").setValidators([Validators.required]);
      }

      this.formGroup.updateValueAndValidity();
      this.formGroup.markAsPristine();
    });

    this.formGroup
      .get("schedule")
      .valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe((schedule: WfmContractType) => {
        const isCustomDays = schedule.type === shiftType.CUSTOM_DAYS;
        this.isFiveDays$.next(isCustomDays);
      });
  }

  public onBack() {
    this._navigationService.navigate(WfmRouterPaths.HOME);
  }

  public onSaveChanges() {
    if (!this.isValidForm()) {
      return;
    }

    const startDate: Date = new Date(this.formGroup.get("startDate").value);
    const startTime: Date = new Date(this.formGroup.get("startTime").value);

    const data: WFMContractsReq = {
      name: this.formGroup.get("name").value,
      shift: {
        duration: +this.formGroup.get("duration").value,
        id: this.formGroup.get("schedule").value.id,
        startDate: !this.isFiveDays$.value ? startDate.toJSON() : null,
        startTime: startTime.toJSON(),
        customDays: this.isFiveDays$.value
          ? this.formGroup
              .get("customDays")
              .value.map((day: WfmWeekDay) => ({ type: day.type, weeknumber: day.number }))
          : null
      }
    };

    if (this.contractId) {
      this._contractService.updateContract(this.contractId, data);
    } else {
      this._contractService
        .createContract(data)
        .pipe(takeUntil(this._destroy$))
        .subscribe(({ id }: { id: number }) => {
          this.contractId = id.toString();
          this._contractService.getContract(this.contractId);
        });
    }
  }

  public onUpdateContractAssignees() {
    this._popup.open({
      component: WfmAssignmentCreateComponent,
      title: "Присвоить сотрудникам",
      data: { contractId: this.contractId, employeeGroup: this.employeeGroup?.employees },
      accept: {
        text: "Обновить",
        role: "accept",
        callback: () => this._contractService.getContract(this.contractId)
      },
      cancel: { callback: () => this._contractService.getContract(this.contractId) }
    });
  }

  public unassignEmployee(employee: { fullname: string; id: number }) {
    this._contractService.unassignEmployee.setParams(this.contractId, employee.id.toString());
    this._contractService.unassignEmployee.get$.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
      this.sortedEmployees = this.sortedEmployees.filter((i: any) => i.id !== employee.id);
      this.employeeGroup.employees = this.employeeGroup?.employees.filter((i: any) => i.id !== employee.id);
      this._cdr.detectChanges();
    });
  }

  public onResultFn = (value: string): Observable<any> => {
    this.filterValue = value.toLowerCase();
    this.sortedEmployees = this._applyFilter(this.employeeGroup?.employees);

    this._cdr.detectChanges();
    return of("");
  };

  public onClearSearch(): void {
    this.filterValue = null;
    this.sortedEmployees = this._applyFilter(this.employeeGroup?.employees);
  }

  private _createCustomDaysValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: WfmWeekDay[] = control.value;

      if (!value) {
        return null;
      }

      const workdayCount = value.reduce((count, day) => {
        if (day.type === WeekDayType.WORKDAY) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);

      return workdayCount < 5 ? { isNotFilled: true } : null;
    };
  }

  private _applyFilter(data: { fullname: string; id: number }[]): { fullname: string; id: number }[] {
    if (!this.filterValue) {
      return data;
    }

    return data.filter((i: any) => i.fullname.toLowerCase().indexOf(this.filterValue) > -1);
  }
}
