import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { TableConfigEditorComponent } from "./table-config-editor.component";
import { TableConfig } from "../table-expandable-rows/table-config";

describe("TableConfigEditorComponent", () => {
  let component: TableConfigEditorComponent;
  let fixture: ComponentFixture<TableConfigEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TableConfigEditorComponent, DragDropModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableConfigEditorComponent);
    component = fixture.componentInstance;
    component.options = new TableConfig({ name: "" });
    fixture.detectChanges();
  });

  it("should compile", () => {
    expect(component).toBeTruthy();
  });
});
