import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterModule } from "@angular/router";
import { TabsNavComponent } from "src/app/shared/components/tabs-nav/tabs-nav.component";
import { ArtInstituteComponent } from "./art-institute.component";

describe("ArtInstituteComponent", () => {
  let component: ArtInstituteComponent;
  let fixture: ComponentFixture<ArtInstituteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsNavComponent, RouterModule.forRoot([]), ArtInstituteComponent],
    });
    fixture = TestBed.createComponent(ArtInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
