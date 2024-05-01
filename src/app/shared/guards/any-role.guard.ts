import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification } from "src/app/models/notification";


export const anyRoleGuard: CanActivateFn = (route, state) => {
  const notifService = inject(NotificationService);
  const loginService = inject(LoginService);

  let roles: string[] = route.data["roles"] ?? [];

  if (loginService.getLoggedUser().roles.filter(value => roles.includes(value)).length == 0) {
    notifService.notify(
      new Notification({
        severity: "sever",
        message: `acces forbidden: you need on of ${roles} roles to access to ${state.url}`,
        show: true,
        persistent: true
      }));
    return false;
  }
  return true;
};
