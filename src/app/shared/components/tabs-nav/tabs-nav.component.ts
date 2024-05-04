import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, Type, booleanAttribute, inject } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";

import {
	ActivatedRoute,
	ChildrenOutletContexts,
	Router,
	RouterLink,
	RouterModule,
	RouterOutlet,
} from "@angular/router";
import { MenuNode, NavBuilder } from "./models/nav-builder";

import { MatIconModule } from "@angular/material/icon";
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
		MatIconModule,
		RouterLink,
		RouterOutlet,
	],
	animations: [slideInAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsNavComponent implements OnInit, AfterViewInit {
	@Input("path") path: string = "";
	@Input("default") default?: string;
	@Input({ transform: booleanAttribute }) sticky = false;
	navLinks: MenuNode[] = [];
	activeLinkIndex = -1;
	private _notifService = inject(NotificationService);

	animation = "";

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private contexts: ChildrenOutletContexts,
	) { }

	ngOnInit(): void {
		console.info("[tab-nav] router config", this.router);
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
			NavBuilder.nodeFromPath(".", c.path, (c.data ?? {})["icon"])
		);
	}
	ngAfterViewInit(): void {
		//if the current navgation is this path, then navigate to defautl child route
		if (this.default && this.router.createUrlTree([this.path]).toString() === this.router.routerState.snapshot.url) {
			console.log(`[tab-nav] navigate to default ${this.default} relative to ${this.route}`);
			this.router.navigate([this.default], { relativeTo: this.route });
		}
	}

	onActivate(component: Type<any>) {
		this.animation = this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"];
		console.info(`[tab-nav] activate animation ${this.animation} ${component.toString()}`);
	}

	// prepareRoute(outlet: RouterOutlet) {
	// 	console.info(`[tab-nav] prepareRoute ${outlet?.activatedRouteData && outlet.activatedRouteData['animation']}`);
	// 	//return this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"];
	// 	return (
	// 		outlet?.activatedRouteData &&
	// 		outlet.activatedRouteData['animation']
	// 	);
	// }
}

