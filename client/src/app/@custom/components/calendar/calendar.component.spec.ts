import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalendarComponent } from "./calendar.component";
import { DateFormatPipe } from "@custom/common/pipes/data-format.pipe";

describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarComponent, DateFormatPipe],
      providers: [DateFormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
