import { VERSION as CDK_VERSION } from "@angular/cdk";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject } from "@angular/core";
import { VERSION as MAT_VERSION } from "@angular/material/core";
import { TranslateService } from "@ngx-translate/core";

import { FlatTreeControl } from "@angular/cdk/tree";
import {
	MatTreeFlatDataSource,
	MatTreeFlattener,
} from "@angular/material/tree";

import { MatSidenavContainer } from "@angular/material/sidenav";
import { Router } from "@angular/router";
import { Observable, map, shareReplay } from "rxjs";
import { NotificationService } from "./core/services/notification.service";
import { ScrollService } from "./core/services/scroll.service";
import { Notification } from "./models/notification";
import {
	MenuNode,
	NavBuilder,
} from "./shared/components/tabs-nav/models/nav-builder";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["/app.component.scss"],
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
		private router: Router,
		private service: NotificationService,
		translate: TranslateService,
		private scrollService: ScrollService
	) {
		// this language will be used as a fallback when a translation isn't found in the current language
		translate.setDefaultLang("en-US");

		// the lang to use, if the lang isn't available, it will use the current loader to get them
		translate.use("en-US");
		//menu content
		this.dataSource.data = NavBuilder.buildTree("", this.router.config);
		console.info("menu datasource", this.dataSource.data);

		this.notifications$ = this.service.notifications$;
	}

	ngAfterViewInit(): void {
		this.sidenavContainer.scrollable.elementScrolled().subscribe(() => this.scrollService.scroll());


	}
	//menu
	private _transformer = (node: MenuNode, level: number): MenuFlatNode => {
		return {
			expandable: !!node.children && node.children.length > 0,
			name: node.name,
			path: node.path,
			level: level,
		};
	};

	treeControl = new FlatTreeControl<MenuFlatNode>(
		(node) => node.level,
		(node) => node.expandable
	);

	treeFlattener = new MatTreeFlattener(
		this._transformer,
		(node) => node.level,
		(node) => node.expandable,
		(node) => node.children
	);

	dataSource = new MatTreeFlatDataSource(
		this.treeControl,
		this.treeFlattener
	);

	hasChild = (_: number, node: MenuFlatNode) => node.expandable;
}

/** Flat node with expandable and level information */
interface MenuFlatNode {
	expandable: boolean;
	name: string;
	path: string;
	level: number;
}
