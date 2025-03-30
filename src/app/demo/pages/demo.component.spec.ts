import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { TabsNavComponent } from "src/app/shared/components/tabs-nav/tabs-nav.component";
import { DemoComponent } from "./demo.component";

describe("DemoComponent", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsNavComponent, RouterModule.forRoot([]), NoopAnimationsModule, DemoComponent],
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
