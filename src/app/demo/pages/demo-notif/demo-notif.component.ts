import { Component } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification, NotificationSeverity } from "src/app/models/notification";


type NotifLog = {
  id: string,
  message: string,
  severity: NotificationSeverity
  action: "add" | "update";
}

@Component({
  selector: 'app-demo-notif',
  templateUrl: './demo-notif.component.html',
  styleUrl: './demo-notif.component.scss'
})
export class DemoNotifComponent {

  readonly notifs: NotifLog[] = [];
  show = false;
  severity: NotificationSeverity = "info";
  persistent = true;



  constructor(
    private service: NotificationService,
  ) {
    this.service.notification$.subscribe((n) => this.logNotif(n));
  }
  clear() {
    this.service.clear();
  }


  addNotif(): void {
    let cnt = Math.floor(Math.random() * 101);
    let notif = this.service.notify(
      new Notification({
        severity: this.severity,
        message:
          cnt % 3 === 0
            ? `message #${cnt}: notif message body, notif message body, notif message body, notif message body, notif message body, notif message body `
            : `short message # ${cnt}`,
        show: this.show,
        persistent: this.persistent
      })
    );
  }

  addRandom(): void {
    let cnt = Math.floor(Math.random() * 101);
    const severity = ["info", "warn", "sever"][Math.floor(Math.random() * 3)] as NotificationSeverity;
    const show = cnt % 4 !== 0;
    this.service.notify(
      new Notification({
        severity: severity,
        message:
          cnt % 3 === 0
            ? `message #${cnt}: random message body, random message body, random message body, random message body, random message body, random message body `
            : `short random message # ${cnt}`,
        show: !(cnt % 4 === 0),
        ref: cnt % 2 === 0 ? "https://material.angular.io/" : undefined
      }));

  }


  private logNotif(notif: Notification, action: "add" | "update" = "add"): void {
    this.notifs.push({ message: notif.message, id: notif.id, action: action, severity: notif.severity });
  }
}

