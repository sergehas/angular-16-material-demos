import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { TabsNavComponent } from "src/app/shared/components/tabs-nav/tabs-nav.component";
import { VoidNavComponent } from "./void-nav.component";

describe("VoidNavComponent", () => {
  let component: VoidNavComponent;
  let fixture: ComponentFixture<VoidNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidNavComponent],
      imports: [TabsNavComponent, RouterModule.forRoot([]), NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(VoidNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
