import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { IconSelectComponent } from "./icon-select.component";

describe("IconSelectComponent", () => {
  let component: IconSelectComponent;
  let fixture: ComponentFixture<IconSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconSelectComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(IconSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
