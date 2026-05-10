import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TGridFilterComponent } from "./tgrid-filter.component";
import { PaginatorModule } from "@custom/components/paginator";
import { InputModule } from "@custom/components/input/input.module";
import { ButtonModule } from "@custom/components/button/button.module";
import { CheckboxModule } from "@custom/components/checkbox/checkbox.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";

describe("TGridFilterComponent", () => {
  let component: TGridFilterComponent;
  let fixture: ComponentFixture<TGridFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TGridFilterComponent],
      imports: [PaginatorModule, InputModule, ButtonModule, CheckboxModule, CustomCommonModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGridFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
