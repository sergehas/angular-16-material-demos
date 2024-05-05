import { Route } from "@angular/router";
import { Role } from "src/app/core/services/login.service";

// tree menu mangement
export interface MenuNode {
	name: string;
	path: string;
	icon?: string;
	children?: MenuNode[];
	roles?: Role[],
	granted?: boolean;
}
export class NavBuilder {
	static nodeFromPath(parent: string, path?: string, icon?: string, roles?: Role[]): MenuNode {
		const currentPath = path ? `${parent}/${path}` : parent;
		return { name: path!, path: `${currentPath}`, icon: icon, roles: roles };
	}

	static buildTree(parent: string, routes: Route[]): MenuNode[] {
		let menu: MenuNode[] = [];
		for (let route of routes) {
			let node: MenuNode = NavBuilder.nodeFromPath(parent, route.path,
				(route.data ?? {})["icon"],
				(route.data ?? {})["roles"],
			);
			if (route.children) {
				node.children = NavBuilder.buildTree(node.path, route.children);
			}
			menu.push(node);
		}
		return menu;
	}
}
