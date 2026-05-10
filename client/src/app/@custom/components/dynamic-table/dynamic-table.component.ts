import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { DynamicTableCell, DynamicTableRow } from "@custom/components/dynamic-table/dynamic-table";

@Component({
  selector: "custom-dynamic-table",
  templateUrl: "./dynamic-table.component.html",
  styleUrls: ["./dynamic-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DynamicTableComponent {
  @Output() rowEditClick: EventEmitter<DynamicTableRow> = new EventEmitter();
  @Output() cellEditClick: EventEmitter<{ cellData: DynamicTableCell; rowData: DynamicTableRow }> = new EventEmitter();

  @Input() isCellView = true;
  @Input() sidebarWidth = 320;
  @Input() columnHeight = 44;
  @Input() columnWidth = 120;
  @Input() headerTemplate: TemplateRef<any>;
  @Input() columnTemplate: TemplateRef<any>;
  @Input() headerData: DynamicTableRow;
  @Input() dataSource: DynamicTableRow[];
  @Input() canEditRow = true;
  @Input() canEditCell = true;

  public getColumnData(rows: DynamicTableCell[], columnId: string | number): DynamicTableCell {
    return rows.find((_) => _.columnId === columnId);
  }
}
