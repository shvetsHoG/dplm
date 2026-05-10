import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PeriodDropdownComponent } from "./period-dropdown.component";

describe("PeriodDropdownComponent", () => {
  let component: PeriodDropdownComponent;
  let fixture: ComponentFixture<PeriodDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PeriodDropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
