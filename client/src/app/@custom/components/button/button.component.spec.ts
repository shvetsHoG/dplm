import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ButtonComponent } from "./button.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("ButtonComponent", () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css("button"));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("icon", () => {
    it("hasn`t icon", () => {
      fixture.detectChanges();
      const iconEl = fixture.debugElement.query(By.css("custom-svg-icon"));
      expect(iconEl).not.toBeUndefined();
    });

    it("has icon", () => {
      component.icon = "icon";
      fixture.detectChanges();
      const iconEl = fixture.debugElement.query(By.css("custom-svg-icon"));
      expect(iconEl).not.toBeUndefined();
    });
  });

  describe("disabled", () => {
    it("is disabled", () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(buttonEl.nativeElement.disabled).toBeTruthy();
    });

    it("is enabled", () => {
      fixture.detectChanges();
      expect(buttonEl.nativeElement.disabled).toBeFalsy();
    });
  });

  it("onClick called", () => {
    const spy = spyOn(component, "onClick");
    buttonEl.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  describe("buttonClick", () => {
    it("called", () => {
      let event: MouseEvent;
      fixture.detectChanges();
      component.buttonClick.subscribe((e) => (event = e));
      buttonEl.triggerEventHandler("click", new Event("click"));
      expect(event).toBeTruthy();
    });

    it("not called by loading reason", () => {
      let event: MouseEvent;
      component.loading = true;
      fixture.detectChanges();
      component.buttonClick.subscribe((e) => (event = e));
      buttonEl.triggerEventHandler("click", new Event("click"));
      expect(event).toBeUndefined();
    });

    it("not called by disabled reason", () => {
      let event: MouseEvent;
      component.disabled = true;
      fixture.detectChanges();
      component.buttonClick.subscribe((e) => (event = e));
      buttonEl.triggerEventHandler("click", new Event("click"));
      expect(event).toBeUndefined();
    });
  });
});
