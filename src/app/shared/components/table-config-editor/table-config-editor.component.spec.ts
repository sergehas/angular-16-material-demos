import { DragDropModule } from "@angular/cdk/drag-drop";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TableConfig } from "../table-expandable-rows/table-config";
import { TableConfigEditorComponent } from "./table-config-editor.component";

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
    fixture.componentRef.setInput("options", new TableConfig({ name: "" }));
    fixture.detectChanges();
  });

  it("should compile", () => {
    expect(component).toBeTruthy();
  });
});
