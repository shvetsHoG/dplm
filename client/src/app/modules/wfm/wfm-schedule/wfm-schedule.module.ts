import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WfmScheduleComponent } from "app/modules/wfm/wfm-schedule/wfm-schedule.component";
import { WfmScheduleGridComponent } from "./wfm-schedule-grid/wfm-schedule-grid.component";
import { WfmContractsComponent } from "./wfm-contracts/wfm-contracts.component";
import { WfmTimetableComponent } from "./wfm-timetable/wfm-timetable.component";
import { WfmActivitiesComponent } from "./wfm-activities/wfm-activities.component";
import { WfmContractsService } from "app/services/wfm/wfm-contracts.service";
import { WfmDictService } from "app/services/wfm/wfm-dict.service";
import { WfmContractsRouterService } from "app/modules/wfm/wfm-schedule/wfm-contracts/wfm-contracts.router";
import { WfmNewContractComponent } from "./wfm-contracts/wfm-new-contract/wfm-new-contract.component";
import { ReactiveFormsModule } from "@angular/forms";
import { WfmContractsCheckboxGroupComponent } from "./wfm-contracts/wfm-contracts-checkbox-group/wfm-contracts-checkbox-group.component";
import { WfmAssignmentCreateComponent } from "./wfm-contracts/wfm-assignment-create/wfm-assignment-create.component";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { WfmScheduleService } from "app/services/wfm/wfm-schedule.service";
import { WfmScheduleEmployeeChooseComponent } from "./wfm-timetable/wfm-schedule-employee-choose/wfm-schedule-employee-choose.component";
import { WfmTimetableEventCreateComponent } from "./wfm-timetable/wfm-timetable-event-create/wfm-timetable-event-create.component";
import { CustomModule } from "@custom/custom-module";

const components = [
  WfmScheduleComponent,
  WfmScheduleGridComponent,
  WfmContractsComponent,
  WfmTimetableComponent,
  WfmActivitiesComponent,
  WfmNewContractComponent,
  WfmContractsCheckboxGroupComponent,
  WfmAssignmentCreateComponent,
  WfmScheduleEmployeeChooseComponent,
  WfmTimetableEventCreateComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, CustomModule, ReactiveFormsModule, CustomCommonModule],
  exports: [...components],
  providers: [WfmContractsService, WfmDictService, WfmContractsRouterService, WfmScheduleService]
})
export class WfmScheduleModule {
  static rootComponent = WfmScheduleComponent;
}
