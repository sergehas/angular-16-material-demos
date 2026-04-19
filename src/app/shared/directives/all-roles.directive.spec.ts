import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginService, Role } from "@app/core/login/services/login.service";
import { AllRolesDirective } from "./all-roles.directive";

/**
 * Host component used to drive inputs/outputs of `AllRolesDirective`.
 */
@Component({
  selector: "app-host-all-roles-test",
  standalone: true,
  imports: [AllRolesDirective],
  template: `<div [appAllRoles]="roles" (granted)="onGranted($event)"></div>`,
})
class HostAllRolesTestComponent {
  roles: string[] | Role[] | undefined = [];
  grantedValues: boolean[] = [];

  /**
   * Captures emitted authorization values for assertions.
   * @param value Authorization result emitted by the directive.
   */
  onGranted(value: boolean): void {
    this.grantedValues.push(value);
  }
}

interface ISetupResult {
  fixture: ComponentFixture<HostAllRolesTestComponent>;
  host: HostAllRolesTestComponent;
  loginServiceSpy: jasmine.SpyObj<LoginService>;
  hasAllRolesSpy: jasmine.Spy<(roles: Role[]) => boolean>;
}

/**
 * Configures test bed and returns host fixture + spies.
 */
function setup(): ISetupResult {
  const hasAllRolesSpy = jasmine.createSpy<(roles: Role[]) => boolean>("hasAllRoles");
  const loggedUserMock = { hasAllRoles: hasAllRolesSpy };
  const loginServiceSpy = jasmine.createSpyObj<LoginService>("LoginService", ["getLoggedUser"]);
  loginServiceSpy.getLoggedUser.and.returnValue(loggedUserMock as never);

  TestBed.configureTestingModule({
    imports: [HostAllRolesTestComponent],
    providers: [{ provide: LoginService, useValue: loginServiceSpy }],
  });

  const fixture = TestBed.createComponent(HostAllRolesTestComponent);
  const host = fixture.componentInstance;

  return { fixture, host, loginServiceSpy, hasAllRolesSpy };
}

describe("AllRolesDirective", () => {
  it("should emit true when roles are undefined", () => {
    const { fixture, host, loginServiceSpy, hasAllRolesSpy } = setup();
    host.roles = undefined;

    fixture.detectChanges();

    expect(host.grantedValues).toEqual([true]);
    expect(loginServiceSpy.getLoggedUser).not.toHaveBeenCalled();
    expect(hasAllRolesSpy).not.toHaveBeenCalled();
  });

  it("should emit true when roles are an empty array", () => {
    const { fixture, host, loginServiceSpy, hasAllRolesSpy } = setup();
    host.roles = [];

    fixture.detectChanges();

    expect(host.grantedValues).toEqual([true]);
    expect(loginServiceSpy.getLoggedUser).not.toHaveBeenCalled();
    expect(hasAllRolesSpy).not.toHaveBeenCalled();
  });

  it("should emit true when user has all required roles", () => {
    const { fixture, host, loginServiceSpy, hasAllRolesSpy } = setup();
    const roles = ["ADMIN", "USER"] as Role[];
    hasAllRolesSpy.and.returnValue(true);
    host.roles = roles;

    fixture.detectChanges();

    expect(loginServiceSpy.getLoggedUser).toHaveBeenCalledTimes(1);
    expect(hasAllRolesSpy).toHaveBeenCalledOnceWith(roles);
    expect(host.grantedValues).toEqual([true]);
  });

  it("should emit false when user does not have all required roles", () => {
    const { fixture, host, loginServiceSpy, hasAllRolesSpy } = setup();
    const roles = ["ADMIN"] as Role[];
    hasAllRolesSpy.and.returnValue(false);
    host.roles = roles;

    fixture.detectChanges();

    expect(loginServiceSpy.getLoggedUser).toHaveBeenCalledTimes(1);
    expect(hasAllRolesSpy).toHaveBeenCalledOnceWith(roles);
    expect(host.grantedValues).toEqual([false]);
  });
});
