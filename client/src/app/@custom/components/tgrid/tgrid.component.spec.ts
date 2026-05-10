import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TGridComponent } from "./tgrid.component";
import { TGridColumnComponent } from "./tgrid-column/tgrid-column.component";
import { TGridFilterComponent } from "./tgrid-filter/tgrid-filter.component";
import { TGridOverlayComponent } from "./tgrid-overlay/tgrid-overlay.component";
import { TGridDetailComponent } from "./tgrid-detail/tgrid-detail.component";
import { PaginatorModule } from "../paginator";
import { InputModule } from "../input/input.module";
import { ButtonModule } from "../button/button.module";
import { CheckboxModule } from "../checkbox/checkbox.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { TGridFilterService } from "./tgrid-filter.service";
import { TGridSortService } from "./tgrid-sort.service";

describe("TGridComponent", () => {
  let component: TGridComponent;
  let fixture: ComponentFixture<TGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TGridComponent,
        TGridColumnComponent,
        TGridFilterComponent,
        TGridOverlayComponent,
        TGridDetailComponent
      ],
      imports: [PaginatorModule, InputModule, ButtonModule, CheckboxModule, CustomCommonModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
