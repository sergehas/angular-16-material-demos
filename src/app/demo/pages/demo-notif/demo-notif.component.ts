import { Component } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";
import { merge } from "rxjs";
import {
  Notification,
  NotificationSeverity,
  ProgressNotification,
} from "src/app/core/models/notification";
import { NotificationService } from "src/app/core/services/notification.service";

type NotifLog = {
  id: string;
  message: string;
  severity: NotificationSeverity;
  action: "add" | "update";
};

@Component({
  selector: "app-demo-notif",
  templateUrl: "./demo-notif.component.html",
  styleUrl: "./demo-notif.component.scss",
})
export class DemoNotifComponent {
  readonly notifs: NotifLog[] = [];
  show = false;
  severity: NotificationSeverity = "info";
  persistent = true;
  lastProgressNotif?: ProgressNotification;
  total = new FormControl<number>({ value: -1, disabled: true });
  value = new FormControl<number>({ value: -1, disabled: true });

  constructor(private service: NotificationService) {
    this.service.notification$.subscribe((n) => this.logNotif(n));

    merge(this.total.valueChanges, this.value.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateProgress());

    this.service.notifications$.subscribe((cache) => {
      if (cache.size == 0) {
        this.total.disable();
        this.value.disable();
      }
    });
  }
  updateProgress() {
    if (this.lastProgressNotif === undefined) {
      return;
    }
    this.lastProgressNotif!.progress.position.total = this.total.value!;
    this.lastProgressNotif!.progress.position.value = this.value.value!;
    console.info(
      `update progress to ${this.lastProgressNotif!.progress.position.value} / ${this.lastProgressNotif!.progress.position.total}`
    );
    this.lastProgressNotif!.message = `Progress update at updated ${new Date().toISOString()}`;

    this.total.setValue(this.lastProgressNotif!.progress.position.total, {
      emitEvent: false,
    });
    this.value.setValue(this.lastProgressNotif!.progress.position.value, {
      emitEvent: false,
    });
  }

  clear() {
    this.service.clear();
  }

  addNotif(): void {
    const cnt = Math.floor(Math.random() * 101);
    this.service.notify(
      new Notification({
        severity: this.severity,
        message:
          cnt % 3 === 0
            ? `message #${cnt}: notif message body, notif message body, notif message body, notif message body, notif message body, notif message body `
            : `short message # ${cnt}`,
        show: this.show,
        persistent: this.persistent,
      })
    );
  }

  addRandom(): void {
    const cnt = this.notifs.length;
    const severity = ["info", "warn", "sever"][
      Math.floor(Math.random() * 3)
    ] as NotificationSeverity;
    if (cnt % 3 === 0) {
      this.lastProgressNotif = this.service.notify(
        new ProgressNotification({
          severity: severity,
          message:
            cnt % 5 === 0
              ? `message #${cnt}: Progress random message body, random message body, random message body, random message body, random message body, random message body `
              : `Progress short random message # ${cnt}`,
          show: !(cnt % 4 === 0),
          ref: cnt % 2 === 0 ? "https://material.angular.io/" : undefined,
        })
      ) as ProgressNotification;
      this.total.enable();
      this.value.enable();
    } else {
      this.service.notify(
        new Notification({
          severity: severity,
          message:
            cnt % 3 === 0
              ? `message #${cnt}: random message body, random message body, random message body, random message body, random message body, random message body `
              : `short random message # ${cnt}`,
          show: !(cnt % 4 === 0),
          ref: cnt % 2 === 0 ? "https://material.angular.io/" : undefined,
        })
      );
    }
  }

  private logNotif(
    notif: Notification,
    action: "add" | "update" = "add"
  ): void {
    this.notifs.push({
      message: notif.message,
      id: notif.id,
      action: action,
      severity: notif.severity,
    });
  }
}
