import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DemoModule } from "../../demo.module";
import { DemoDatasourceComponent } from "./demo-datasource.component";

describe("DemoDatasourceComponent", () => {
  let component: DemoDatasourceComponent;
  let fixture: ComponentFixture<DemoDatasourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [DemoModule, NoopAnimationsModule, DemoDatasourceComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
});
    fixture = TestBed.createComponent(DemoDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // imposible test : mixup with matTable fireing events & capturing/renderingdatasource event logs
  xit("should create", () => {
    expect(component).toBeTruthy();
  });
});
