import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchPanelComponent } from "./search-panel.component";
import { InputModule } from "../input/input.module";
import { IconsModule } from "../icons/icons.module";

describe("SearchPanelComponent", () => {
  let component: SearchPanelComponent;
  let fixture: ComponentFixture<SearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPanelComponent],
      imports: [InputModule, IconsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
