import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DemoModule } from "../../demo.module";
import { DemoNotifComponent } from "./demo-notif.component";

describe("DemoNotifComponent", () => {
  let component: DemoNotifComponent;
  let fixture: ComponentFixture<DemoNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoModule, NoopAnimationsModule, DemoNotifComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
