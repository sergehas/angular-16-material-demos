import { CommonModule } from "@angular/common";
import { Component, Input, booleanAttribute, inject } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";

import {
	ChildrenOutletContexts,
	Router,
	RouterLink,
	RouterModule,
	RouterOutlet,
} from "@angular/router";
import { MenuNode, NavBuilder } from "./models/nav-builder";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NotificationService } from "src/app/core/services/notification.service";
import { Notification } from "src/app/models/notification";
import { slideInAnimation } from "../../animations/route-animation";

@Component({
	selector: "app-tabs-nav",
	templateUrl: "./tabs-nav.component.html",
	styleUrls: ["./tabs-nav.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatTabsModule,
		MatSnackBarModule,
		RouterLink,
		RouterOutlet,
	],
	animations: [slideInAnimation],
})
export class TabsNavComponent {
	@Input("path") path: string = "";
	@Input({ transform: booleanAttribute }) sticky = false;
	navLinks: MenuNode[] = [];
	activeLinkIndex = -1;
	private _notifService = inject(NotificationService);


	constructor(
		private router: Router,
		private contexts: ChildrenOutletContexts,
	) { }
	getRouteAnimationData() {
		console.log("getRouteAnimationData");
		return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
			"animation"
		];
	}
	ngOnInit(): void {
		console.info("router config", this.router);
		const root = this.router.config.find((p) => p.path === this.path);
		const children = root ? root.children : undefined;
		if (!children || children.length <= 0) {
			this._notifService.notify(
				new Notification({
					severity: "warn",
					message: `${this.path} has no menu entry`,
					show: true,
					persistent: false
				}));
			return;
		}

		this.navLinks = children.map((c) =>
			NavBuilder.nodeFromPath(".", c.path)
		);
	}
}
