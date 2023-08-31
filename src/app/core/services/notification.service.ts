import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type NotificationSeverity = "info" | "warn" | "sever";
export interface NotificationDef {
	severity: NotificationSeverity;
	message: string;
	date?: Date;
	ref?: string;
	persisent?: boolean;
}

export class Notification implements NotificationDef {
	readonly severity: NotificationSeverity;
	readonly message: string;
	readonly date?: Date;
	readonly ref?: string;
	readonly persisent?: boolean;
	constructor(def: NotificationDef) {
		this.severity=def.severity;
		this.message=def.message;
		this.date = def.date ?? new Date();
		this.ref=def.ref;
		this.persisent=def.persisent ?? false;


	}
}

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private cache = new Set<Notification>();
	public notifications$ = new BehaviorSubject(this.cache).asObservable();
	constructor() {}
	notify(notif: Notification): Notification {
		console.log("Notif: ", notif);
		this.cache.add(notif);
		return notif;
	}

	dismiss(notif: Notification): void {
		this.cache.delete(notif);
	}

	clear(): void {
		this.cache.clear();
	}
}
