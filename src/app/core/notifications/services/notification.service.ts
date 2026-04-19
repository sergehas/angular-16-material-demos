import { Injectable } from "@angular/core";
import { Notification } from "@app/core/notifications/models/notification";
import { BehaviorSubject, Subject } from "rxjs";

/**
 * Service that manages notification propagation and persistent notification cache.
 *
 * - `notification$` emits transient notifications for snackbars or immediate listeners.
 * - `notifications$` emits the current cache snapshot for persistent notification views.
 */
@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly cache = new Set<Notification>();
  private readonly notificationCacheSubject = new BehaviorSubject(this.cache);
  public readonly notifications$ = this.notificationCacheSubject.asObservable();
  private readonly notificationSubject = new Subject<Notification>();
  public readonly notification$ = this.notificationSubject.asObservable();

  /**
   * Notify listeners and persist the notification if requested.
   *
   * @param notif Notification payload to emit.
   * @param propagate When true, emit to `notification$` subscribers.
   * @returns The original notification for fluent use.
   */
  notify(notif: Notification, propagate = true): Notification {
    console.log("[NotificationService] Notif: ", notif);
    if (propagate) {
      this.notificationSubject.next(notif);
    }
    if (notif.persistent) {
      this.cache.add(notif);
      this.notificationCacheSubject.next(this.cache);
    }
    return notif;
  }

  /**
   * Remove a notification from the persistent cache.
   * Always emits the latest cache snapshot so UIs stay in sync.
   * @param notif The notification to remove from cache. If not found, cache remains unchanged but is still emitted.
   */
  dismiss(notif: Notification): void {
    console.log("[NotificationService] Dismiss: ", notif);
    console.log("[NotificationService] notif found:", this.cache.has(notif));
    this.cache.delete(notif);
    this.notificationCacheSubject.next(this.cache);
  }

  /**
   * Update an existing notification in cache or add a new persistent one.
   * Non-persistent notifications are removed if they were previously cached.
   * @param notif The notification to update or add. Must have a valid `id` for updates.
   */
  update(notif: Notification): void {
    console.log("[NotificationService] Update: ", notif);

    if (notif.persistent) {
      this.cache.add(notif);
    } else if (this.cache.has(notif)) {
      console.log("[NotificationService] notif was persistent,  delete it");
      this.cache.delete(notif);
    }
    this.notificationCacheSubject.next(this.cache);
  }

  /**
   * Clear all persistent notifications from cache.
   */
  clear(): void {
    this.cache.clear();
    this.notificationCacheSubject.next(this.cache);
  }

  /**
   * Re-emit the current cache snapshot without modifying it.
   */
  load(): void {
    this.notificationCacheSubject.next(this.cache);
  }
}
