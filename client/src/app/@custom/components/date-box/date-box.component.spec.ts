import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DateBoxComponent } from "./date-box.component";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { ButtonModule } from "../button/button.module";
import { CalendarModule } from "../calendar/calendar.module";
import { InputModule } from "../input/input.module";
import { IconsModule } from "../icons/icons.module";

describe("DateBoxComponent", () => {
  let component: DateBoxComponent;
  let fixture: ComponentFixture<DateBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateBoxComponent],
      imports: [CustomCommonModule, ButtonModule, CalendarModule, ButtonModule, InputModule, IconsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
