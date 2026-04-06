import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { DemoExportComponent } from "./demo-export.component";

describe("DemoExportComponent", () => {
  let component: DemoExportComponent;
  let fixture: ComponentFixture<DemoExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoExportComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
