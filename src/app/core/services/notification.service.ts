import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Notification } from "src/app/models/notification";

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private cache = new Set<Notification>();
	public notifications$ = new BehaviorSubject(this.cache).asObservable();
	private notificationSubject = new Subject<Notification>();
	public notification$ = this.notificationSubject.asObservable();

	constructor() { }

	notify(notif: Notification, propagate = true): Notification {
		console.log("Notif: ", notif);
		if (propagate) {
			this.notificationSubject.next(notif);
		}
		if (notif.persistent) {
			this.cache.add(notif);
		}
		return notif;
	}

	dismiss(notif: Notification): void {
		console.log("Dismiss: ", notif);
		console.log("notif found:", this.cache.has(notif));
		this.cache.delete(notif);
	}
	update(notif: Notification): void {
		console.log("Update: ", notif);

		if (notif.persistent) {
			this.cache.add(notif)
		} else if (this.cache.has(notif)) {
			console.log("notif was persistent,  delete it");
			this.cache.delete(notif);
		}

	}

	clear(): void {
		this.cache.clear();
	}
}
