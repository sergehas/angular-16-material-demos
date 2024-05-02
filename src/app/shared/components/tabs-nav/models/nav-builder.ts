import { Route } from "@angular/router";

// tree menu mangement
export interface MenuNode {
	name: string;
	path: string;
	icon?: string;
	children?: MenuNode[];
}
export class NavBuilder {
	static nodeFromPath(parent: string, path?: string, icon?: string): MenuNode {
		const currentPath = path ? `${parent}/${path}` : parent;
		return { name: path!, path: `${currentPath}`, icon: icon };
	}

	static buildTree(parent: string, routes: Route[]): MenuNode[] {
		let menu: MenuNode[] = [];
		for (let route of routes) {
			let icon = (route.data ?? {})["icon"];
			let node: MenuNode = NavBuilder.nodeFromPath(parent, route.path, icon);
			if (route.children) {
				node.children = NavBuilder.buildTree(node.path, route.children);
			}
			menu.push(node);
		}
		return menu;
	}
}
