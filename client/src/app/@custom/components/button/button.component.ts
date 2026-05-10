import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { ButtonRole } from "./model/button-role";
import { ButtonSize } from "./model/button-size";
import { ButtonShape } from "./model/button-shape";
import { ButtonColor } from "./model/button-color";

@Component({
    selector: "custom-button",
    templateUrl: "./button.component.html",
    styleUrls: ["./button.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ButtonComponent implements OnInit {
  @ViewChild("button") buttonRef: ElementRef;

  public readonly ButtonRole = ButtonRole;
  public readonly ButtonSize = ButtonSize;
  public readonly ButtonShape = ButtonShape;
  public readonly ButtonColor = ButtonColor;

  @Output() buttonClick: EventEmitter<MouseEvent> = new EventEmitter();

  @Input() role: ButtonRole;
  @Input() size: ButtonSize;
  @Input() shape: ButtonShape;
  @Input() color: ButtonColor;
  @Input() action = "button";
  @Input() text: string;
  @Input() width: any;
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() icon: string;
  @Input() label: string;
  @Input() blurAfterClick = false;

  constructor() {}

  ngOnInit() {}

  public onClick(e: MouseEvent): void {
    e.stopPropagation();

    if (this.blurAfterClick) {
      this.buttonRef.nativeElement.blur();
    }

    if (this.loading || this.disabled) {
      return;
    }

    this.buttonClick.emit(e);
  }
}
