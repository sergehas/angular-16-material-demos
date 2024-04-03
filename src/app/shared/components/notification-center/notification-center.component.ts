import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	inject
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import {
	MAT_SNACK_BAR_DATA,
	MatSnackBar,
	MatSnackBarModule,
	MatSnackBarRef,
} from "@angular/material/snack-bar";

import { MatIconModule } from "@angular/material/icon";
import {
	Notification,
	NotificationService
} from "src/app/core/services/notification.service";

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
	) { }

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
