import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DemoModule } from "../../demo.module";
import { DemoTableComponent } from "./demo-table.component";

describe("DemoTableComponent", () => {
  let component: DemoTableComponent;
  let fixture: ComponentFixture<DemoTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoTableComponent],
      imports: [DemoModule, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(DemoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
