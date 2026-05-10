import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  OnDestroy,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { TGridItem } from "../models/tgrid-item";

@Component({
    selector: "app-tgrid-detail",
    templateUrl: "./tgrid-detail.component.html",
    styleUrls: ["./tgrid-detail.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TGridDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() detailTemplate: TemplateRef<any>;
  @Input() item: TGridItem;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.item.detail = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ("item" in changes) {
      this.item.detail = this;
    }
  }
}
