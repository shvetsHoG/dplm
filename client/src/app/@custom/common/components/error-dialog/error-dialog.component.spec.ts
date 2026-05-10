import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ErrorDialogComponent } from "./error-dialog.component";
import { DateFormatPipe } from "@custom/common/pipes/data-format.pipe";
import { PopupModel } from "@custom/components/popup/models/popup-model";

describe("ErrorDialogComponent", () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorDialogComponent, DateFormatPipe],
      providers: [{ provide: "popup", useValue: new PopupModel({}) }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
