import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TableExpandableRowsComponent } from "./table-expandable-rows.component";
import { TableConfig } from "./table-config";

describe("TableExpandableRowsComponent", () => {
  let component: TableExpandableRowsComponent<any>;
  let fixture: ComponentFixture<TableExpandableRowsComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableExpandableRowsComponent],
    });
    fixture = TestBed.createComponent(TableExpandableRowsComponent);
    component = fixture.componentInstance;
    component.options = new TableConfig({ name: "" });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
