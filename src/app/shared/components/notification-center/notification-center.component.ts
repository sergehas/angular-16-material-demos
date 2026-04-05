import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
} from "@angular/material/snack-bar";

import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { Notification } from "@app/core/notifications/models/notification";
import { NotificationService } from "@app/core/notifications/services/notification.service";
import { NotificationComponent } from "@app/shared/components/notification-center/notification.component";

@Component({
  selector: "app-notification-center",
  templateUrl: "./notification-center.component.html",
  styleUrls: ["./notification-center.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
    NotificationComponent,
  ],
})
export class NotificationCenterComponent {
  private readonly service = inject(NotificationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  //reexpose notif observable
  notifications$ = this.service.notifications$;
  severityFilter = new FormControl(["info", "warn", "severe"]);
  sort = "asc";

  constructor() {
    this.service.notification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((n) => this.showNotification(n));
  }

  toggleSort() {
    if (this.sort === "asc") {
      this.sort = "desc";
    } else {
      this.sort = "asc";
    }
  }
  displayNotification(notif: Notification): boolean {
    return this.severityFilter.value!.includes(notif.severity);
  }

  trackItem(_index: number, item: Notification) {
    return item.id;
  }

  private showNotification(n: Notification) {
    if (!n.show) {
      return;
    }
    this.snackBar.openFromComponent(NotificationSnackBarComponent, {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000,
      data: n,
      panelClass: [`notif-swe-${n.severity}`],
    });
  }

  dismiss(n: Notification) {
    this.service.dismiss(n);
  }
  clear() {
    this.service.clear();
  }
}

@Component({
  selector: "app-notification-snack-bar",
  templateUrl: "notification-snack-bar.component.html",
  styleUrls: ["./notification-snack-bar.component.scss"],
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule],
})
export class NotificationSnackBarComponent {
  data = inject<Notification>(MAT_SNACK_BAR_DATA);
  private readonly service = inject(NotificationService);

  private readonly snackBarRef = inject(MatSnackBarRef);

  close() {
    console.log("close");
    this.snackBarRef.dismiss();
  }
  dismissNotification(n: Notification) {
    console.log("dismiss notif", n);
    this.snackBarRef.dismiss();
    this.service.dismiss(n);
  }
}
