import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterModule } from "@angular/router";
import { TabsNavComponent } from "@app/shared/components/tabs-nav/tabs-nav.component";
import { VoidNavComponent } from "./void-nav.component";

describe("VoidNavComponent", () => {
  let component: VoidNavComponent;
  let fixture: ComponentFixture<VoidNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsNavComponent, RouterModule.forRoot([]), VoidNavComponent],
    });
    fixture = TestBed.createComponent(VoidNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
