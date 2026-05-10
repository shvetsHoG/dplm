import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TGridOverlayComponent } from "./tgrid-overlay.component";

describe("TGridOverlayComponent", () => {
  let component: TGridOverlayComponent;
  let fixture: ComponentFixture<TGridOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TGridOverlayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGridOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
