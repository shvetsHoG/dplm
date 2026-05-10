import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { WfmContractsService } from "app/services/wfm/wfm-contracts.service";
import { WfmContractsRouterType } from "app/modules/wfm/wfm-schedule/wfm-contracts/wfm-contracts.router";
import { WfmRouterPaths } from "app/models/wfm/wfm";
import { WFMContract } from "app/models/wfm/wfm-contracts";
import { map, takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";
import { BehaviorSubject, combineLatest, merge } from "rxjs";
import { ErrorHandlerService } from "@custom/common/services/error-handler.service";

@Component({
  selector: "app-wfm-contracts",
  templateUrl: "./wfm-contracts.component.html",
  styleUrls: ["./wfm-contracts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  standalone: false
})
export class WfmContractsComponent implements OnInit {
  contracts$ = this._contractService.getContracts.store$;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public page = 1;
  public limit = 16;

  constructor(
    private _contractService: WfmContractsService,
    private _destroy$: DestroyService,
    private _errorService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this._getContracts(this.page);

    combineLatest([this._contractService.getContracts.isLoading$, this._contractService.deleteContract.isLoading$])
      .pipe(
        map((loading) => loading.some(Boolean)),
        takeUntil(this._destroy$)
      )
      .subscribe(this.isLoading$);

    merge(this._contractService.deleteContract.errorHandler$, this._contractService.getContracts.errorHandler$)
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

  public onChangePage(page: number): void {
    if (this.page !== page) {
      this.page = page;
      this._getContracts(this.page);
    }
  }

  public onDelete(id: number): void {
    this.page = 1;
    this._contractService.deleteContract.setParams(id.toString());
    this._contractService.deleteContract.get$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._getContracts(this.page));
  }

  public onClickNewContract() {}

  public openContract(data: WFMContract) {}

  private _getContracts(page: number): void {
    if (!page) {
      this.page = 1;
    }

    this._contractService.getContracts(this.limit, (page - 1) * this.limit);
  }
}
