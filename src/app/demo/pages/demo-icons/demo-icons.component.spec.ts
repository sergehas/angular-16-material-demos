import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoIconsComponent } from "./demo-icons.component";

describe("DemoIconsComponent", () => {
  let component: DemoIconsComponent;
  let fixture: ComponentFixture<DemoIconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoIconsComponent],
    });
    fixture = TestBed.createComponent(DemoIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
