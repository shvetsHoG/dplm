import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectBoxOverlayComponent } from "./select-box-overlay.component";
import { InputModule } from "@custom/components/input/input.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { IconsModule } from "@custom/components/icons/icons.module";
import { SelectBoxComponent } from "../select-box.component";

describe("OverlayComponent", () => {
  let component: SelectBoxOverlayComponent;
  let fixture: ComponentFixture<SelectBoxOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBoxComponent, SelectBoxOverlayComponent],
      imports: [InputModule, CustomCommonModule, IconsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBoxOverlayComponent);
    component = fixture.componentInstance;
    component.instance = TestBed.createComponent(SelectBoxComponent).componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
