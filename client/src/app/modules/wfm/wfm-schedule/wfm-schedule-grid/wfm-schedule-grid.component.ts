import { Component, EventEmitter, Input, Output } from "@angular/core";
import { WFMContract } from "app/models/wfm/wfm-contracts";
import { PopupService } from "@custom/components/popup/popup.service";

@Component({
  selector: "app-wfm-schedule-grid",
  templateUrl: "./wfm-schedule-grid.component.html",
  styleUrls: ["./wfm-schedule-grid.component.scss"],
  standalone: false
})
export class WfmScheduleGridComponent {
  @Input() data: WFMContract[] = [];

  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();
  @Output() onRowClick: EventEmitter<WFMContract> = new EventEmitter<WFMContract>();

  constructor(private _popup: PopupService) {}

  public onDeleteContract(e: PointerEvent, item: WFMContract): void {
    e.stopPropagation();

    this._popup.open({
      title: "Удалить контракт",
      content: "Вы уверены, что хотите удалить контракт?",
      data: {
        data: item
      },
      accept: {
        text: "Удалить",
        role: "accept",
        callback: () => {
          this.onDelete.emit(item.id);
        }
      },
      cancel: {
        text: "Отмена"
      }
    });
  }
}
