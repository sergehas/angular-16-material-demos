import { CommonModule } from "@angular/common";
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnDestroy,
	inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
	MAT_SNACK_BAR_DATA,
	MatSnackBar,
	MatSnackBarModule,
	MatSnackBarRef,
} from "@angular/material/snack-bar";
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
	changeDetection: ChangeDetectionStrategy.Default,
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
	) {
		this.service.notification$.subscribe((n) => this.showNotification(n));
	}
	trackItem(index: number, item: Notification) {
		return item.date;
	}
	private showNotification(n: Notification) {
		if (!n.show) {
			return;
		}
		this.snackBar.openFromComponent(NotificationSnackBarComponent, {
			horizontalPosition: "center",
			verticalPosition: "top",
			duration: 3000,
			data: n,
		});
	}

	dismiss(n: Notification) {
		this.service.dismiss(n);
	}
	clear() {
		this.service.clear();
	}

	//demo stuff
	private cnt = 0;
	addNotif() {
		this.cnt++;
		const severity = ["info", "warn", "sever"][
			Math.floor(Math.random() * 3)
		] as NotificationSeverity;
		const show = this.cnt % 4 !== 0;
		this.service.notify(
			new Notification({
				severity: severity,
				message:
					this.cnt % 3 === 0
						? `message #${this.cnt}: notif messsage body, notif messsage body, notif messsage body, notif messsage body, notif messsage body, notif messsage body `
						: `short message # ${this.cnt}`,
				show: !(this.cnt % 4 === 0),
			})
		);
	}
}

@Component({
	selector: "notification-snack-bar",
	templateUrl: "notification-snack-bar.component.html",
	styleUrls: ["./notification-snack-bar.component.scss"],
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule],
})
export class NotificationSnackBarComponent {
	private snackBarRef = inject(MatSnackBarRef);
	constructor(
		@Inject(MAT_SNACK_BAR_DATA) public data: Notification,
		private service: NotificationService
	) {}

	close() {
		console.log("close");
		this.snackBarRef.dismiss();
	}
	dismissNotification(n: Notification) {
		console.log("dismiss notif", n);
		this.snackBarRef.dismiss();
		this.service.dismiss(n);
	}
}
