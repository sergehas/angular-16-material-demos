import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Router, RouterModule } from "@angular/router";
import { TabsNavComponent } from "./tabs-nav.component";

describe("TabsNavComponent", () => {
  let component: TabsNavComponent;
  let fixture: ComponentFixture<TabsNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsNavComponent, RouterModule.forRoot([])],
    });
    fixture = TestBed.createComponent(TabsNavComponent);
    TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
