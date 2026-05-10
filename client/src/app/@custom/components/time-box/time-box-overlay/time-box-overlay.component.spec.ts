import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeBoxOverlayComponent } from "./time-box-overlay.component";

describe("TimeBoxOverlayComponent", () => {
  let component: TimeBoxOverlayComponent;
  let fixture: ComponentFixture<TimeBoxOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeBoxOverlayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeBoxOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
