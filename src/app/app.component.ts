import { VERSION as CDK_VERSION } from "@angular/cdk";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject } from "@angular/core";
import { VERSION as MAT_VERSION } from "@angular/material/core";
import { MatSidenavContainer } from "@angular/material/sidenav";
import { RouterOutlet } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, map, shareReplay } from "rxjs";

import { NotificationService } from "./core/services/notification.service";
import { ScrollService } from "./core/services/scroll.service";
import { Notification } from "./models/notification";
import { slideInAnimation } from "./shared/animations/route-animation";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	animations: [slideInAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppComponent implements AfterViewInit {
	@ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;

	title = `Angular ${CDK_VERSION.full} Material ${MAT_VERSION.full} demo`;
	private breakpointObserver = inject(BreakpointObserver);
	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(
			map((result) => result.matches),
			shareReplay()
		);
	notifications$: Observable<Set<Notification>>;

	constructor(
		private service: NotificationService,
		translate: TranslateService,
		private scrollService: ScrollService
	) {
		// this language will be used as a fallback when a translation isn't found in the current language
		translate.setDefaultLang("en-US");

		// the lang to use, if the lang isn't available, it will use the current loader to get them
		translate.use("en-US");


		this.notifications$ = this.service.notifications$;
	}

	ngAfterViewInit(): void {
		this.sidenavContainer.scrollable.elementScrolled().subscribe(() => this.scrollService.scroll());
	}
	prepareRoute(outlet: RouterOutlet) {
		console.info(`[app-root] prepareRoute ${outlet?.activatedRouteData && outlet.activatedRouteData['animation']}`);
		//return this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"];
		return (
			outlet?.activatedRouteData &&
			outlet.activatedRouteData['animation']
		);
	}


}

