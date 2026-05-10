import { Component, OnInit, Inject } from "@angular/core";
import { PopupModel } from "app/@custom/components/popup/models/popup-model";

@Component({
    selector: "app-error-dialog",
    templateUrl: "./error-dialog.component.html",
    styleUrls: ["./error-dialog.component.scss"],
    standalone: false
})
export class ErrorDialogComponent implements OnInit {
  constructor(@Inject("popup") public popup: PopupModel) {}

  ngOnInit() {}
}
