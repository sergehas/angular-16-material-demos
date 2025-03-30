import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { Notification } from "src/app/core/models/notification";
import { LoginService, Role } from "src/app/core/services/login.service";
import { NotificationService } from "src/app/core/services/notification.service";

export const anyRoleGuard: CanActivateFn = (route, state) => {
  const notifyService = inject(NotificationService);
  const loginService = inject(LoginService);

  const roles: Role[] = route.data["roles"] ?? [];

  if (!loginService.getLoggedUser().hasAnyRoles(roles)) {
    notifyService.notify(
      new Notification({
        severity: "sever",
        message: `access forbidden: you need on of ${roles} roles to access to ${state.url}`,
        show: true,
        persistent: true,
      })
    );
    return false;
  }
  return true;
};

export const allRoleGuard: CanActivateFn = (route, state) => {
  const notifyService = inject(NotificationService);
  const loginService = inject(LoginService);

  const roles: Role[] = route.data["roles"] ?? [];

  if (!loginService.getLoggedUser().hasAllRoles(roles)) {
    notifyService.notify(
      new Notification({
        severity: "sever",
        message: `acces forbidden: you need all of ${roles} roles to access to ${state.url}`,
        show: true,
        persistent: true,
      })
    );
    return false;
  }
  return true;
};
