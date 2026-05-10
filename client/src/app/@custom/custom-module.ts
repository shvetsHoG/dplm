import { NgModule } from "@angular/core";
import { DynamicTableModule } from "@custom/components/dynamic-table/dynamic-table.module";
import { IconsModule } from "@custom/components/icons/icons.module";
import { PopupModule } from "@custom/components/popup/popup.module";
import { ButtonModule } from "@custom/components/button/button.module";
import { DateBoxModule } from "@custom/components/date-box/date-box.module";
import { PaginatorModule } from "@custom/components/paginator";
import { InputModule } from "@custom/components/input/input.module";
import { ToastModule } from "@custom/components/toast/toast.module";
import { TooltipModule } from "@custom/components/tooltip/tooltip.module";
import { TimeIntervalModule } from "@custom/components/time-interval/time-interval.module";
import { TimeBoxModule } from "@custom/components/time-box/time-box.module";
import { CalendarModule } from "@custom/components/calendar/calendar.module";
import { CheckboxModule } from "@custom/components/checkbox/checkbox.module";
import { SelectBoxModule } from "@custom/components/select-box/select-box.module";
import { SearchPanelModule } from "@custom/components/search-panel/search-panel.module";
import { TextareaModule } from "@custom/components/textarea/textarea.module";
import { PeriodModule } from "@custom/components/period/period.module";
import { TabsModule } from "@custom/components/tabs/tabs.module";
import { TGridModule } from "@custom/components/tgrid/tgrid.module";

const modules = [
  ButtonModule,
  DynamicTableModule,
  InputModule,
  PaginatorModule,
  PopupModule,
  IconsModule,
  DateBoxModule,
  TooltipModule,
  ToastModule,
  TimeIntervalModule,
  TimeBoxModule,
  CalendarModule,
  CheckboxModule,
  SelectBoxModule,
  SearchPanelModule,
  PeriodModule,
  TextareaModule,
  TabsModule,
  TGridModule
];

@NgModule({
  declarations: [],
  exports: [...modules],
  imports: [...modules]
})
export class CustomModule {}
