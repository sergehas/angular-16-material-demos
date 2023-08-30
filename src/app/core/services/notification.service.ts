import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Notification {
	severity: "info" | "warn" | "sever";
	message: string;
	ref?: string;
	persisent?: boolean;
}

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private cache = new Set<Notification>();
	public notifications$ = new BehaviorSubject(this.cache).asObservable();
	constructor() {}
	notify(notif: Notification): Notification {
    console.log("notif")
		this.cache.add(notif);
    return notif;

	}

	dismiss(notif: Notification): void {
    console.log("dismiss")
		this.cache.delete(notif);
	}

	clear(): void {
    console.log("clear")
		this.cache.clear();
	}
}
