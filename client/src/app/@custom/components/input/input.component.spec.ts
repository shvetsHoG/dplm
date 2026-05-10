import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InputComponent } from "./input.component";
import { IconsModule } from "../icons/icons.module";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("InputComponent", () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let inputEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [IconsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css("input"));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("input events change value", () => {
    it("paste", () => {
      const value = "test";
      const clipboardData = new DataTransfer();
      clipboardData.setData("text/plain", value);
      const event: ClipboardEvent = new ClipboardEvent("paste", { clipboardData });

      inputEl.nativeElement.value = value;
      inputEl.triggerEventHandler("input", { target: inputEl.nativeElement });
      inputEl.triggerEventHandler("paste", event);

      expect(component.value === value).toBeTruthy();
    });
  });
});
