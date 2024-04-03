import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { v4 as uuid } from 'uuid';

export type NotificationSeverity = "info" | "warn" | "sever";
export interface NotificationDef {
	severity: NotificationSeverity;
	message: string;
	date?: Date;
	ref?: string;
	persistent?: boolean;
	show?: boolean;
}

export class Notification implements NotificationDef {
	readonly id: string;
	readonly severity: NotificationSeverity;
	readonly message: string;
	readonly date: Date;
	readonly ref?: string;
	readonly persistent: boolean;
	readonly show: boolean;

	constructor(def: NotificationDef) {
		this.id = uuid();
		this.severity = def.severity;
		this.message = def.message;
		this.date = def.date ?? new Date();
		this.ref = def.ref;
		this.persistent = def.persistent === undefined ? true : def.persistent;
		this.show = def.show === undefined ? true : def.show;
	}
}

export class ProgressNotification extends Notification {


	constructor(def: NotificationDef) {
		super(def);
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
