import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoNotifComponent } from "./demo-notif.component";

describe("DemoNotifComponent", () => {
  let component: DemoNotifComponent;
  let fixture: ComponentFixture<DemoNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoNotifComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
