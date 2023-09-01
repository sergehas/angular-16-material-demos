import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

export type NotificationSeverity = "info" | "warn" | "sever";
export interface NotificationDef {
	severity: NotificationSeverity;
	message: string;
	date?: Date;
	ref?: string;
	persisent?: boolean;
	show?: boolean;
}

export class Notification implements NotificationDef {
	readonly severity: NotificationSeverity;
	readonly message: string;
	readonly date: Date;
	readonly ref?: string;
	readonly persisent: boolean;
	readonly show: boolean;
	constructor(def: NotificationDef) {
		this.severity = def.severity;
		this.message = def.message;
		this.date = def.date ?? new Date();
		this.ref = def.ref;
		this.persisent = def.persisent === undefined ? true : def.persisent;
		this.show = def.show === undefined ? true : def.show;
	}
}

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private cache = new Set<Notification>();
	public notifications$ = new BehaviorSubject(this.cache).asObservable();
	private notificationSubject = new Subject<Notification>();
	public notification$ = this.notificationSubject.asObservable();

	constructor() {}

	notify(notif: Notification, proragate = true): Notification {
		console.log("Notif: ", notif);
		if (proragate) {
			this.notificationSubject.next(notif);
		}
		if (notif.persisent) {
			this.cache.add(notif);
		}
		return notif;
	}

	dismiss(notif: Notification): void {
		console.log("Dismiss: ", notif);
		console.log("notif found:", this.cache.has(notif));
		this.cache.delete(notif);
	}

	clear(): void {
		this.cache.clear();
	}
}
