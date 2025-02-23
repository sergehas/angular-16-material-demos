import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Notification } from "src/app/core/models/notification";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly cache = new Set<Notification>();
  private readonly notificationCacheSubject = new BehaviorSubject(this.cache);
  public readonly notifications$ = this.notificationCacheSubject.asObservable();
  private readonly notificationSubject = new Subject<Notification>();
  public readonly notification$ = this.notificationSubject.asObservable();

  constructor() { }

  notify(notif: Notification, propagate = true): Notification {
    console.log("[NotificationService] Notif: ", notif);
    if (propagate) {
      this.notificationSubject.next(notif);
    }
    if (notif.persistent) {
      this.cache.add(notif);
    }
    return notif;
  }

  dismiss(notif: Notification): void {
    console.log("[NotificationService] Dismiss: ", notif);
    console.log("[NotificationService] notif found:", this.cache.has(notif));
    this.cache.delete(notif);
  }
  update(notif: Notification): void {
    console.log("[NotificationService] Update: ", notif);

    if (notif.persistent) {
      this.cache.add(notif);
    } else if (this.cache.has(notif)) {
      console.log("[NotificationService] notif was persistent,  delete it");
      this.cache.delete(notif);
    }
  }

  clear(): void {
    this.cache.clear();
    this.notificationCacheSubject.next(this.cache);
  }

  load(): void {
    this.notificationCacheSubject.next(this.cache);
  }
}
