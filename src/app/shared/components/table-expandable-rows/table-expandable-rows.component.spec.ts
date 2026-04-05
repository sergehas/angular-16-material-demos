import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpService } from "@app/core/commons/services/http-service";
import { PageableDataSource } from "@app/core/datasources/models/pageable-data-source";
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
      imports: [TableExpandableRowsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(TableExpandableRowsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("options", new TableConfig({ name: "" }));
    fixture.componentRef.setInput("dataSource", new PageableDataSource(serviceSpy));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
