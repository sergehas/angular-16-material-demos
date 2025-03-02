import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoComponent } from "./demo.component";
import { TabsNavComponent } from "src/app/shared/components/tabs-nav/tabs-nav.component";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";

describe("DemoComponent", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoComponent],
      imports: [TabsNavComponent, RouterTestingModule.withRoutes([]), NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(DemoComponent);
    TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
