import { Component, ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { ScrollService } from "src/app/core/services/scroll.service";
import { StickDirective } from "./stick.directive";

/**
 * Test component to host the directive.
 */
@Component({
  template: `<div #topRef style="position: relative">
    <section>
      <h1>This demo illustrate usage of the <code>appStick</code></h1>
      <h2 [appStick]="topRef">Overview</h2>
    </section>
  </div>`,
  imports: [StickDirective],
})
class TestComponent {}

describe("StickDirective", () => {
  let directive: StickDirective;
  let fixture: ComponentFixture<TestComponent>;
  let mockElementRef: ElementRef;
  let mockScrollService: jasmine.SpyObj<ScrollService>;
  const mockScrolling$ = new Subject<void>();

  beforeEach(() => {
    mockElementRef = {
      nativeElement: document.createElement("div"),
    } as ElementRef;

    mockScrollService = jasmine.createSpyObj("ScrollService", [], { scrolling$: mockScrolling$ });

    fixture = TestBed.configureTestingModule({
      imports: [StickDirective, TestComponent],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: ScrollService, useValue: mockScrollService },
      ],
    }).createComponent(TestComponent);
    directive = fixture.debugElement
      .query(By.directive(StickDirective))
      .injector.get(StickDirective);
  });

  it("should create an instance", () => {
    expect(directive).toBeTruthy();
  });
});
