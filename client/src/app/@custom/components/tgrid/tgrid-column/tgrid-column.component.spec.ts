import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TGridColumnComponent } from "./tgrid-column.component";

describe("TGridColumnComponent", () => {
  let component: TGridColumnComponent;
  let fixture: ComponentFixture<TGridColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TGridColumnComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGridColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
