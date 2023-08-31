import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";

import {
	NotificationService,
	Notification,
	NotificationSeverity,
} from "src/app/core/services/notification.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-notification-center",
	templateUrl: "./notification-center.component.html",
	styleUrls: ["./notification-center.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
	],
})
export class NotificationCenterComponent {
	//reexpose notif observable
	notifications$ = this.service.notifications$;

	constructor(
		private service: NotificationService,
		private snackBar: MatSnackBar
	) {}

	showNotif(n: Notification) {
		this.snackBar.open(`${n.message}`, "dismiss", {
			horizontalPosition: "center",
			verticalPosition: "top",
			duration: 5000,
		});
	}

	dismiss(n: Notification) {
		this.service.dismiss(n);
	}
	clear() {
		this.service.clear();
	}

	private cnt = 0;
	addNotif() {
		this.cnt++;
		const severity = ["info", "warn", "sever"][
			Math.floor(Math.random() * 3)
		] as NotificationSeverity;

		this.service.notify(
			new Notification({
				severity: severity,
				message:
					this.cnt % 3 === 0
						? `message #${this.cnt}: notif messsage body, notif messsage body, notif messsage body, notif messsage body, notif messsage body, notif messsage body `
						: `short message # ${this.cnt}`,
			})
		);
	}
}
