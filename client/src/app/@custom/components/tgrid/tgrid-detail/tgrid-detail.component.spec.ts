import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TGridDetailComponent } from "./tgrid-detail.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TGridComponent } from "../tgrid.component";
import { TGridColumnComponent } from "../tgrid-column/tgrid-column.component";
import { TGridFilterComponent } from "../tgrid-filter/tgrid-filter.component";
import { TGridOverlayComponent } from "../tgrid-overlay/tgrid-overlay.component";
import { PaginatorModule } from "@custom/components/paginator";
import { InputModule } from "@custom/components/input/input.module";
import { ButtonModule } from "@custom/components/button/button.module";
import { CheckboxModule } from "@custom/components/checkbox/checkbox.module";
import { CustomCommonModule } from "@custom/common/custom-common.module";
import { TGridItem } from "../models/tgrid-item";
import { TGridFilterService } from "../tgrid-filter.service";
import { TGridSortService } from "../tgrid-sort.service";

describe("TGridDetailComponent", () => {
  let component: TGridDetailComponent;
  let fixture: ComponentFixture<TGridDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TGridComponent,
        TGridColumnComponent,
        TGridFilterComponent,
        TGridOverlayComponent,
        TGridDetailComponent
      ],
      imports: [
        BrowserAnimationsModule,
        PaginatorModule,
        InputModule,
        ButtonModule,
        CheckboxModule,
        CustomCommonModule
      ],
      providers: [TGridFilterService, TGridSortService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGridDetailComponent);
    component = fixture.componentInstance;
    // component.parent = TestBed.createComponent(TGridComponent).componentInstance;
    component.item = new TGridItem(1, {}, 1);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
