import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DynamicTableCell, DynamicTableRow } from "@custom/components/dynamic-table/dynamic-table";
import { WfmScheduleService } from "app/services/wfm/wfm-schedule.service";
import { WfmScheduleEmployeeChooseComponent } from "app/modules/wfm/wfm-schedule/wfm-timetable/wfm-schedule-employee-choose/wfm-schedule-employee-choose.component";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { DestroyService } from "app/services/destroy.service";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import {
  WfmEmployeesEvent,
  WfmItems,
  WfmEventColors,
  WfmEvent,
  WfmScheduleShiftCycleBlocks
} from "app/models/wfm/wfm-schedule";
import { WfmDictService } from "app/services/wfm/wfm-dict.service";
import { WfmContractType, WfmEventType } from "app/models/wfm/wfm-dict";
import { shiftType, WeekDayType } from "app/models/wfm/wfm";
import { WfmTimetableEventCreateComponent } from "app/modules/wfm/wfm-schedule/wfm-timetable/wfm-timetable-event-create/wfm-timetable-event-create.component";
import { getDateToYMD } from "@custom/extensions/date-to-string";
import { PopupService } from "@custom/components/popup/popup.service";

@Component({
  selector: "app-wfm-timetable",
  templateUrl: "./wfm-timetable.component.html",
  styleUrls: ["./wfm-timetable.component.scss"],
  providers: [DestroyService],
  standalone: false
})
export class WfmTimetableComponent implements OnInit {
  public getCalendar$: Subject<void> = new Subject();

  public dateStart: Date = new Date();
  public dateEnd: Date = new Date(new Date().setMonth(this.dateStart.getMonth() + 1));

  public eventTypes: WfmEventType[] = [];
  public contractTypes: WfmContractType[] = [];

  public limit = 13;
  public page = 1;
  public totalCount = 0;

  public headerData: DynamicTableRow = {
    label: "Сотрудники",
    data: []
  };

  public dataSource: DynamicTableRow<WfmEmployeesEvent>[] = [];

  public items: WfmEmployeesEvent[] = [];

  public canAdministrateWFM = false;

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public readonly tabsData = [
    { id: 1, name: "День" },
    { id: 2, name: "Месяц" }
  ];

  public readonly weekDayType = WeekDayType;

  constructor(
    private _popupService: PopupService,
    private _dictService: WfmDictService,
    private _service: WfmScheduleService,
    private _popup: PopupService,
    private _destroy$: DestroyService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    combineLatest([
      this._service.getEvents.isLoading$,
      this._service.changeEvent.isLoading$,
      this._service.createEvent.isLoading$,
      this._service.deleteEvent.isLoading$,
      this._dictService.getEventTypes.isLoading$,
      this._dictService.getContractTypes.isLoading$
    ])
      .pipe(
        map((loading) => loading.some(Boolean)),
        takeUntil(this._destroy$)
      )
      .subscribe(this.isLoading$);

    this._dictService
      .getEventTypes()
      .pipe(takeUntil(this._destroy$))
      .subscribe((eventTypes) => (this.eventTypes = eventTypes));

    this._dictService
      .getContractTypes()
      .pipe(takeUntil(this._destroy$))
      .subscribe((contractTypes) => (this.contractTypes = contractTypes));

    this._service.getEvents.store$.pipe(takeUntil(this._destroy$)).subscribe((data: WfmItems) => {
      this.totalCount = data.totalCount;
      this.items = data.items;
      this.dataSource = this._getDataSourceForTable(this.items);

      this._cdr.detectChanges();
    });

    this._service.employeesList$.pipe(takeUntil(this._destroy$)).subscribe(() => this.getCalendar$.next());

    this.getCalendar$
      .pipe(
        debounceTime(100),
        switchMap(() =>
          this._service.getEvents(
            this._getColumnId(this.dateStart),
            this._getColumnId(this.dateEnd),
            this._service.employeesList$.value.map((_) => _.id).join(","),
            this.limit,
            (this.page - 1) * this.limit
          )
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._cdr.detectChanges());
  }

  public onChooseEmployeeClick() {
    this._popup.open({
      component: WfmScheduleEmployeeChooseComponent,
      title: "Выбор сотрудников",
      accept: {
        text: "Сохранить",
        role: "accept",
        callback: () => (this.page = 1)
      },
      cancel: { text: "Отмена" }
    });
  }

  public openCreateEventPopup(data: DynamicTableRow<WfmEmployeesEvent>) {
    this._popupService.open({
      title: "Активность",
      data: this._getPopupData(data),
      component: WfmTimetableEventCreateComponent,
      accept: {
        text: "Назначить",
        role: "accept",
        callback: () => this.getCalendar$.next()
      },
      cancel: { text: "Отмена" }
    });
  }

  public openUpdateEventPopup(data: {
    cellData: DynamicTableCell<WfmEvent>;
    rowData: DynamicTableRow<WfmEmployeesEvent>;
  }) {
    if (!data.cellData.additionalData) {
      this.openCreateEventPopup(data.rowData);
    } else {
      this._popupService.open({
        title: "Редактировать активность",
        data: { ...this._getPopupData(data.rowData), isEdit: true, event: data.cellData.additionalData },
        component: WfmTimetableEventCreateComponent,
        accept: {
          text: "Сохранить изменения",
          role: "accept",
          callback: () => this.getCalendar$.next()
        },
        cancel: { text: "Отмена" }
      });
    }
  }

  public onDateChange() {
    const data: DynamicTableCell[] = [];
    const currDate = new Date(new Date(this.dateStart).setHours(0, 0, 0, 0));
    const endDate = new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0));

    const formatter = new Intl.DateTimeFormat("ru-RU", {
      weekday: "short",
      month: "short"
    });

    while (currDate <= endDate) {
      const parts = formatter.formatToParts(currDate);

      data.push({
        columnId: this._getColumnId(currDate),
        text: {
          first: currDate.getDate(),
          second: parts.find((p) => p.type === "weekday")?.value,
          third: parts.find((p) => p.type === "month")?.value
        },
        additionalData: {
          type: currDate.getDay() === 0 || currDate.getDay() === 6 ? this.weekDayType.WEEKEND : this.weekDayType.WORKDAY
        }
      });

      currDate.setDate(currDate.getDate() + 1);
    }

    this.headerData = { label: this.headerData.label, data };
    this.page = 1;
    this.getCalendar$.next();
  }

  public isNow(date: string): boolean {
    return this._getColumnId(new Date()) === date;
  }

  public onChangePage(page: number): void {
    if (this.page === page) {
      return;
    }

    this.page = page;

    this.getCalendar$.next();
  }

  private _getDataSourceForTable(employees: WfmEmployeesEvent[]): DynamicTableRow<WfmEmployeesEvent>[] {
    return employees.map((employee) => {
      let dtc: DynamicTableCell[] = [];

      for (const schedule of employee.contracts) {
        const currDate = new Date(new Date(schedule.startDt || this.dateStart).setHours(0, 0, 0, 0));
        const endDate = new Date(new Date(schedule.endDt || this.dateEnd).setHours(0, 0, 0, 0));

        while (currDate <= endDate) {
          if (schedule.shift.type === shiftType.CUSTOM_DAYS) {
            const weekDay = schedule.shift.customDays.find((day) => {
              const currDay = currDate.getDay() === 0 ? 6 : currDate.getDay() - 1; // TODO: костыль, 0 в js - Суббота, а здесь - ПН
              return day.weeknumber === currDay;
            });

            const { color, text } = this._getTableCellParams(
              weekDay.type,
              schedule.shift.startTime,
              schedule.shift.duration
            );

            dtc.push({ columnId: this._getColumnId(currDate), color, text } as DynamicTableCell);

            currDate.setDate(currDate.getDate() + 1);
          } else if (schedule.shift.type === shiftType.CYCLE) {
            const first = schedule.shift.cycleBlocks?.find((day) => day.order === 0);
            const second = schedule.shift.cycleBlocks?.find((day) => day.order === 1);

            const cycleArray: WfmScheduleShiftCycleBlocks[] = [];

            for (let i = 0; i < first.daysCount; i++) {
              cycleArray.push(first);
            }

            for (let i = 0; i < second.daysCount; i++) {
              cycleArray.push(second);
            }

            // вычисляем индекс первого рабочего дня - т.е. реальный первый рабочий день сотрудника
            const index = this._getFirstCycleBlockIndex(schedule.shift.startDate, currDate, cycleArray.length);

            for (let i = index; i < cycleArray.length + index; i++) {
              if (currDate <= endDate) {
                const { color, text } = this._getTableCellParams(
                  cycleArray[i % 4].type,
                  schedule.shift.startTime,
                  schedule.shift.duration
                );

                dtc.push({ columnId: this._getColumnId(currDate), color, text } as DynamicTableCell);
              }

              currDate.setDate(currDate.getDate() + 1);
            }
          }
        }

        dtc = this._getTableCellEvents(dtc, employee.events);
      }

      return {
        additionalData: employee,
        label: employee.employee.fullname,
        data: dtc
      } as DynamicTableRow<WfmEmployeesEvent>;
    });
  }

  private _getTableCellEvents(dtc: DynamicTableCell[], events: WfmEvent[]): DynamicTableCell[] {
    let cells: DynamicTableCell[] = [...dtc];

    for (const event of events) {
      const startDate = new Date(event.startDt);
      const endDate = new Date(event.endDt);
      const type = event.type;

      while (startDate <= endDate) {
        let cell = cells.find((_) => _.columnId === this._getColumnId(startDate));

        cell = { ...cell, color: type.color, text: type.name, additionalData: event };

        cells = cells.filter((_) => _.columnId !== this._getColumnId(startDate));
        cells.push(cell);

        startDate.setDate(startDate.getDate() + 1);
      }
    }

    return cells;
  }

  private _getTableCellParams(
    type: WeekDayType,
    startTime: Date,
    duration: number
  ): { color: WfmEventColors; text: string } {
    const color = type === WeekDayType.WORKDAY ? WfmEventColors.WORKDAY : WfmEventColors.WEEKDAY;
    const text = type === WeekDayType.WORKDAY ? this._getShiftHours(startTime, duration) : "Выходной";

    return { color, text };
  }

  private _getShiftHours(start: Date, duration: number): string {
    const end = new Date(new Date(start).setHours(start.getHours() + duration));

    return `${start.getHours()}:${start.getMinutes().toString().padStart(2, "0")}-${end.getHours()}:${end.getMinutes().toString().padStart(2, "0")}`;
  }

  private _getColumnId(date: Date): string {
    return getDateToYMD(date);
  }

  private _getPopupData(data: DynamicTableRow<WfmEmployeesEvent>) {
    return {
      employeeId: data.additionalData.employee.id,
      shift: this._getShiftHours(
        data.additionalData.contracts[0].shift.startTime,
        data.additionalData.contracts[0].shift.duration
      ),
      contractType: this.contractTypes.find((i) => i.type === data.additionalData.contracts[0].shift.type).name,
      employeeName: data.additionalData.employee.fullname,
      eventTypes: this.eventTypes
    };
  }

  private _getFirstCycleBlockIndex(startDate: Date, endDate: Date, length: number): number {
    const ms: number = Math.abs(new Date(endDate).setHours(0, 0, 0, 0) - new Date(startDate).setHours(0, 0, 0, 0));

    const diffDays = Math.round(ms / (1000 * 60 * 60 * 24));

    return Math.floor(diffDays % length);
  }
}
