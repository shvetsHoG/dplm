import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupComponent } from "./popup.component";
import { PopupOverlayComponent } from "./popup-overlay/popup-overlay.component";
import { PopupDraggableDirective } from "./popup-draggable.directive";
import { ButtonModule } from "../button/button.module";
import { PopupService } from "./popup.service";
import { PopupModel } from "./models/popup-model";

describe("PopupComponent", () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupComponent, PopupOverlayComponent, PopupDraggableDirective],
      imports: [ButtonModule],
      providers: [PopupService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    fixture.componentInstance.model = new PopupModel({});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
