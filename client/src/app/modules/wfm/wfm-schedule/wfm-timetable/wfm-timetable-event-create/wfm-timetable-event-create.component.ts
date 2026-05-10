import { Component, Inject } from "@angular/core";
import { PopupModel } from "@custom/components/popup/models/popup-model";
import { WfmEventType } from "app/models/wfm/wfm-dict";
import { WfmScheduleService } from "app/services/wfm/wfm-schedule.service";
import { FormComponentBase } from "@custom/common/base/form.component.base";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { take, takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";

@Component({
  selector: "app-wfm-timetable-event-create",
  templateUrl: "./wfm-timetable-event-create.component.html",
  styleUrls: ["./wfm-timetable-event-create.component.scss"],
  providers: [DestroyService],
  standalone: false
})
export class WfmTimetableEventCreateComponent extends FormComponentBase {
  public employeeId: number;
  public shift = "";
  public contractType = "";
  public employeeName = "";
  public eventTypes: WfmEventType[] = [];
  public isEdit = false;

  public dateDifference: number;

  public formGroup: FormGroup;

  constructor(
    @Inject("popup") public popup: PopupModel,
    private _service: WfmScheduleService,
    private _fb: FormBuilder,
    private _destroy$: DestroyService
  ) {
    super();
    const data = this.popup.data;

    this.employeeId = data.employeeId;
    this.shift = data.shift;
    this.contractType = data.contractType;
    this.employeeName = data.employeeName;
    this.eventTypes = data.eventTypes;
    this.isEdit = data.isEdit;

    this.formGroup = this._fb.group({
      activity: [this.eventTypes[0], [Validators.required]],
      period: [[null, null], [this._createPeriodValidator()]],
      description: [null]
    });

    if (this.isEdit) {
      this.formGroup.get("description").setValue(this.popup.data.event?.desc || null);
      this.formGroup
        .get("period")
        .setValue([this.popup.data.event?.startDt || null, this.popup.data.event?.endDt || null]);
      this.formGroup.get("activity").setValue(this.popup.data.event?.type || null);

      this.onDateChange([this.popup.data.event?.startDt, this.popup.data.event?.endDt]);

      this.popup.accept.innerCommand = () => {
        if (!this.isValidForm()) return;

        this._service.changeEvent.setParams(this.popup.data.event.id, this._getFormValue());
        this._service.changeEvent.get$.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
          this.popup.accept.callback();
          this.popup.close();
        });
      };
    } else {
      this.popup.accept.innerCommand = () => {
        if (!this.isValidForm()) return;

        this._service
          .createEvent(this.employeeId, this._getFormValue())
          .pipe(take(1), takeUntil(this._destroy$))
          .subscribe(() => {
            this.popup.accept.callback();
            this.popup.close();
          });
      };
    }
  }

  public onDateChange(dates: Date[]): void {
    this.dateDifference = Math.round((dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  public onDeleteEvent(): void {
    this._service.deleteEvent.setParams(this.employeeId, this.popup.data.event.id);
    this._service.deleteEvent.get$.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
      this.popup.accept.callback();
      this.popup.close();
    });
  }

  private _getFormValue() {
    return {
      desc: this.formGroup.get("description").value,
      event_type_id: this.formGroup.get("activity").value.id,
      end_dt: new Date(this.formGroup.get("period").value[1].setHours(0, 0, 0, 0)).toJSON(),
      start_dt: new Date(this.formGroup.get("period").value[0].setHours(0, 0, 0, 0)).toJSON()
    };
  }

  private _createPeriodValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: Date[] = control.value;

      if (!value) {
        return null;
      }

      const [first, second] = value;

      return !first || !second ? { isNotPicked: true } : null;
    };
  }
}
