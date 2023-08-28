import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";

import { Router, RouterModule } from "@angular/router";
import { MenuNode, NavBuilder } from "./models/nav-builder";

@Component({
	selector: "app-tabs-nav",
	templateUrl: "./tabs-nav.component.html",
	styleUrls: ["./tabs-nav.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, MatTabsModule],
})
export class TabsNavComponent {
	@Input("path") path: string = "";
	navLinks: MenuNode[] = [];
	activeLinkIndex = -1;

	constructor(private router: Router) {}
	ngOnInit(): void {
		console.log("router config", this.router);

		this.navLinks = this.router.config
			.find((p) => p.path === this.path)!
			.children!.map((c) => NavBuilder.nodeFromPath(".", c.path));

		console.log("links", this.navLinks);
		this.router.events.subscribe((res) => {
			// this.activeLinkIndex
			// = this.navLinks.indexOf(
			// 	this.navLinks.find((tab) => tab.path === "." + this.router.url)
			// ) ;
		});
	}
}
