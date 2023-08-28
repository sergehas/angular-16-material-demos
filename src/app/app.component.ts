import {
	BreakpointObserver,
	Breakpoints,
	MediaMatcher,
} from "@angular/cdk/layout";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
} from "@angular/core";
import { VERSION as CDK_VERSION } from "@angular/cdk";

import { FlatTreeControl } from "@angular/cdk/tree";
import {
	MatTreeFlatDataSource,
	MatTreeFlattener,
} from "@angular/material/tree";

import { VERSION as MAT_VERSION } from "@angular/material/core";
import { Route, Router } from "@angular/router";
import { Observable, map, shareReplay } from "rxjs";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["/app.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	title = `Angular ${CDK_VERSION.full} Material ${MAT_VERSION.full} demo`;
	private breakpointObserver = inject(BreakpointObserver);
	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(
			map((result) => result.matches),
			shareReplay()
		);
	fillerNav = Array.from({ length: 10 }, (_, i) => `Nav Item ${i + 1}`);

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
	constructor(
		private router: Router,
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher
	) {
		//menu content
		this.dataSource.data = buildTree("", this.router.config);
		console.info(this.dataSource.data);
	}
	hasChild = (_: number, node: MenuFlatNode) => node.expandable;
}

// tree menu mangement
interface MenuNode {
	name: string;
	path: string;
	children?: MenuNode[];
}
/** Flat node with expandable and level information */
interface MenuFlatNode {
	expandable: boolean;
	name: string;
	path: string;
	level: number;
}

const nodeFromPath = (parent: string, path?: string): MenuNode => {
	const currentPath = path ? `${parent}/${path}` : parent;
	return { name: path!, path: `${currentPath}` };
};

const buildTree = (parent: string, routes: Route[]): MenuNode[] => {
	let menu: MenuNode[] = [];
	for (let route of routes) {
		let node: MenuNode = nodeFromPath(parent, route.path);
		if (route.children) {
			node.children = buildTree(node.path, route.children);
		}
		menu.push(node);
	}
	return menu;
};
