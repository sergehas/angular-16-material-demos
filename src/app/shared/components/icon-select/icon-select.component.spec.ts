import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconSelectComponent } from "./icon-select.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("IconSelectComponent", () => {
  let component: IconSelectComponent;
  let fixture: ComponentFixture<IconSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconSelectComponent, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(IconSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
