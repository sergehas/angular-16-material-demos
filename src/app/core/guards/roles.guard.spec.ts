import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";

import { LoginService, SignedUser } from "@app/core/login/services/login.service";
import { NotificationService } from "@app/core/notifications/services/notification.service";
import { allRoleGuard, anyRoleGuard } from "./roles.guard";

describe("anyRoleGuard", () => {
  let notificationService: jasmine.SpyObj<NotificationService>;
  let loginService: jasmine.SpyObj<LoginService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => anyRoleGuard(...guardParameters));

  beforeEach(() => {
    notificationService = jasmine.createSpyObj("NotificationService", ["notify"]);
    loginService = jasmine.createSpyObj("LoginService", ["getLoggedUser"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: notificationService },
        { provide: LoginService, useValue: loginService },
      ],
    });
  });

  it("should allow access when user has at least one required role", () => {
    loginService.getLoggedUser.and.returnValue(
      SignedUser.from("Jane", "Doe", "jdoe", true, ["AUTHOR", "VIEWER"])
    );

    const route = { data: { roles: ["ADMIN", "AUTHOR"] } } as unknown as ActivatedRouteSnapshot;
    const state = { url: "/admin" } as unknown as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBeTrue();
    expect(notificationService.notify).not.toHaveBeenCalled();
  });

  it("should deny access and notify when no required role is present", () => {
    loginService.getLoggedUser.and.returnValue(
      SignedUser.from("Jane", "Doe", "jdoe", true, ["VIEWER"])
    );

    const route = { data: { roles: ["ADMIN", "SUPER"] } } as unknown as ActivatedRouteSnapshot;
    const state = { url: "/secure" } as unknown as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBeFalse();
    expect(notificationService.notify).toHaveBeenCalledTimes(1);
    const notification = notificationService.notify.calls.mostRecent().args[0];
    expect(notification.message).toContain("access forbidden");
    expect(notification.message).toContain("ADMIN,SUPER");
    expect(notification.message).toContain("/secure");
    expect(notification.persistent).toBeTrue();
  });

  it("should deny access when roles are not provided", () => {
    loginService.getLoggedUser.and.returnValue(
      SignedUser.from("Jane", "Doe", "jdoe", true, ["AUTHOR"])
    );

    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: "/empty" } as unknown as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBeFalse();
    expect(notificationService.notify).toHaveBeenCalled();
  });
});

describe("allRoleGuard", () => {
  let notificationService: jasmine.SpyObj<NotificationService>;
  let loginService: jasmine.SpyObj<LoginService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => allRoleGuard(...guardParameters));

  beforeEach(() => {
    notificationService = jasmine.createSpyObj("NotificationService", ["notify"]);
    loginService = jasmine.createSpyObj("LoginService", ["getLoggedUser"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: notificationService },
        { provide: LoginService, useValue: loginService },
      ],
    });
  });

  it("should allow access when user has all required roles", () => {
    loginService.getLoggedUser.and.returnValue(
      SignedUser.from("Jane", "Doe", "jdoe", true, ["AUTHOR", "SUPER"])
    );

    const route = { data: { roles: ["AUTHOR", "SUPER"] } } as unknown as ActivatedRouteSnapshot;
    const state = { url: "/manage" } as unknown as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBeTrue();
    expect(notificationService.notify).not.toHaveBeenCalled();
  });

  it("should deny access and notify when user is missing any required role", () => {
    loginService.getLoggedUser.and.returnValue(
      SignedUser.from("Jane", "Doe", "jdoe", true, ["AUTHOR"])
    );

    const route = { data: { roles: ["AUTHOR", "SUPER"] } } as unknown as ActivatedRouteSnapshot;
    const state = { url: "/manage" } as unknown as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBeFalse();
    expect(notificationService.notify).toHaveBeenCalledTimes(1);
    const notification = notificationService.notify.calls.mostRecent().args[0];
    expect(notification.message).toContain("acces forbidden");
    expect(notification.message).toContain("AUTHOR,SUPER");
    expect(notification.message).toContain("/manage");
  });

  it("should allow access when no roles are required", () => {
    loginService.getLoggedUser.and.returnValue(
      SignedUser.from("Jane", "Doe", "jdoe", true, ["VIEWER"])
    );

    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: "/public" } as unknown as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBeTrue();
    expect(notificationService.notify).not.toHaveBeenCalled();
  });
});
