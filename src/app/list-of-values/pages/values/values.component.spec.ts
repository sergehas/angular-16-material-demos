import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ValuesService } from "src/app/core/value-list/services/values.service";

import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ValuesComponent } from "./values.component";

describe("ValuesComponent", () => {
  let component: ValuesComponent;
  let fixture: ComponentFixture<ValuesComponent>;

  beforeEach(() => {
    const service = jasmine.createSpyObj("ValuesService", ["find", "count"]);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ValuesComponent],
      providers: [{ provide: ValuesService, useValue: service }],
    });
    fixture = TestBed.createComponent(ValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
