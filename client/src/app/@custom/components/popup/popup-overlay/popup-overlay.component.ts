import {
  Component,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  Input,
  Output,
  EventEmitter,
  Optional
} from "@angular/core";
import { ThemeService } from "@custom/common/services/theme.service";

@Component({
  selector: "app-popup-overlay",
  templateUrl: "./popup-overlay.component.html",
  styleUrls: ["./popup-overlay.component.scss"],
  standalone: false
})
export class PopupOverlayComponent {
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("containerView", { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  @Input() opacity = 0;
  @Input() hidden: boolean;
  @Input() zIndex: number;

  @Output() overlayClick: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(@Optional() public themeService: ThemeService) { }

  public onClick(e: MouseEvent): void {
    if (e.composedPath().some((i: HTMLElement) => i.classList && i.classList.contains("popup"))) {
      return;
    }

    this.overlayClick.emit(e);
  }
}
