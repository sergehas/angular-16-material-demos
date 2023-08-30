import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";

import {
	ChildrenOutletContexts,
	Router,
	RouterLink,
	RouterModule,
	RouterOutlet,
} from "@angular/router";
import { MenuNode, NavBuilder } from "./models/nav-builder";

import { slideInAnimation } from "../../animations/route-animation";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

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
	navLinks: MenuNode[] = [];
	activeLinkIndex = -1;
	constructor(
		private router: Router,
		private contexts: ChildrenOutletContexts,
		private snackBar: MatSnackBar
	) {}
	getRouteAnimationData() {
		console.log("getRouteAnimationData");
		return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
			"animation"
		];
	}
	ngOnInit(): void {
		console.debug("router config", this.router);
		const root = this.router.config.find((p) => p.path === this.path);
		const children = root ? root.children : undefined;
		if (!children || children.length <= 0) {
			this.snackBar.open(`${this.path} has no menu entry`, "dismiss", {
				horizontalPosition: "center",
				verticalPosition: "top",
				duration: 5000,
			});
			return;
		}

		this.navLinks = children.map((c) =>
			NavBuilder.nodeFromPath(".", c.path)
		);
	}
}
