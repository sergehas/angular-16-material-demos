import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { PageableDataSource } from "src/app/core/models/pageable-data-source";
import { HttpService } from "src/app/core/services/http-service";
import { TableConfig } from "./table-config";
import { TableExpandableRowsComponent } from "./table-expandable-rows.component";

describe("TableExpandableRowsComponent", () => {
  let component: TableExpandableRowsComponent<unknown>;
  let fixture: ComponentFixture<TableExpandableRowsComponent<unknown>>;
  let serviceSpy: jasmine.SpyObj<HttpService<unknown>>;

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj("HttpService", ["get", "count", "find"]);
    TestBed.configureTestingModule({
      declarations: [],
      imports: [TableExpandableRowsComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(TableExpandableRowsComponent);
    component = fixture.componentInstance;
    component.options = new TableConfig({ name: "" });
    component.dataSource = new PageableDataSource(serviceSpy);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
