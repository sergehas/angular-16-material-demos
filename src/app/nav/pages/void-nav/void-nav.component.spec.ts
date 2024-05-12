import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VoidNavComponent } from "./void-nav.component";
import { TabsNavComponent } from "src/app/shared/components/tabs-nav/tabs-nav.component";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("VoidNavComponent", () => {
  let component: VoidNavComponent;
  let fixture: ComponentFixture<VoidNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidNavComponent],
      imports: [
        TabsNavComponent,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(VoidNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
