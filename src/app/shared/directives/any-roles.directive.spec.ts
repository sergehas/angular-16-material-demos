import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { LoginService, SignedUser } from "src/app/core/services/login.service";
import { AnyRolesDirective } from "./any-roles.directive";

/**
 * Test component to host the directive.
 */
@Component({
    template: `<span class="none" [appAnyRoles]="[]"></span>
    <span class="allowed" [appAnyRoles]="['ADMIN', 'AUTHOR']"></span>
    <span class="denied" [appAnyRoles]="['NOT_GRANTED_ROLE']"></span>`,
    imports: [AnyRolesDirective]
})
class TestComponent {}

describe("AnyRolesDirective", () => {
  let directives: AnyRolesDirective[];
  let allowed: AnyRolesDirective;
  let denied: AnyRolesDirective;
  let noRole: AnyRolesDirective;
  let fixture: ComponentFixture<TestComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;

  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj("LoginService", ["getLoggedUser"]);
    mockLoginService.getLoggedUser.and.returnValue(
      SignedUser.from("John", "Doe", "123", true, ["ADMIN", "AUTHOR"])
    );

    fixture = TestBed.configureTestingModule({
      imports: [AnyRolesDirective, TestComponent],
      providers: [AnyRolesDirective, { provide: LoginService, useValue: mockLoginService }],
    }).createComponent(TestComponent);
    fixture.detectChanges();

    directives = fixture.debugElement
      .queryAll(By.directive(AnyRolesDirective))
      .map((de) => de.injector.get(AnyRolesDirective));
    noRole = fixture.debugElement.query(By.css(".none")).injector.get(AnyRolesDirective);
    allowed = fixture.debugElement.query(By.css(".allowed")).injector.get(AnyRolesDirective);
    denied = fixture.debugElement.query(By.css(".denied")).injector.get(AnyRolesDirective);
  });

  it("should create 3 instances", () => {
    expect(directives.length).toBe(3);
  });

  it("should grant access when no roles provided", async () => {
    noRole.granted.subscribe((granted) => {
      expect(granted).toBe(true);
    });
    noRole.ngOnInit();
    expect(mockLoginService.getLoggedUser).toHaveBeenCalled();
  });

  it("should check user roles and emit access status", () => {
    allowed.granted.subscribe((granted) => {
      expect(granted).toBe(true);
    });
    allowed.ngOnInit();
    expect(mockLoginService.getLoggedUser).toHaveBeenCalled();
  });

  it("should handle roles with no access", async () => {
    denied.granted.subscribe((granted) => {
      expect(granted).toBe(false);
    });
    denied.ngOnInit();
    expect(mockLoginService.getLoggedUser).toHaveBeenCalled();
  });
});
