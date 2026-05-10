import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SvgIconComponent } from "./svg-icon.component";
import { SvgIconService } from "./svg-icon.service";
import { SvgIconPathProvide } from "../models/svg-icon-path-provide";

describe("SvgIconComponent", () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SvgIconComponent],
      providers: [SvgIconService, { provide: SvgIconPathProvide, useValue: "icons/svg" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
