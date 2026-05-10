import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectBoxComponent } from "./select-box.component";
import { SelectBoxOverlayComponent } from "./select-box-overlay/select-box-overlay.component";
import { InputModule } from "../input/input.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { IconsModule } from "../icons/icons.module";

describe("SelectBoxComponent", () => {
  let component: SelectBoxComponent;
  let fixture: ComponentFixture<SelectBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBoxComponent, SelectBoxOverlayComponent],
      imports: [InputModule, CustomCommonModule, IconsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
