import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from "@angular/material/tree";
import { Router, RouterModule, RouterOutlet } from "@angular/router";

import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MenuNode, NavBuilder } from "../tabs-nav/models/nav-builder";

/** Flat node with expandable and level information */
interface MenuFlatNode {
  expandable: boolean;
  name: string;
  path: string;
  icon?: string;
  level: number;
}

@Component({
  selector: "app-tree-nav",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTreeModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: "./tree-nav.component.html",
  styleUrl: "./tree-nav.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class TreeNavComponent {
  constructor(private router: Router) {
    //menu content
    this.dataSource.data = NavBuilder.buildTree("", this.router.config);
    console.info("[app-tree-nav] menu datasource", this.dataSource.data);
  }

  prepareRoute(outlet: RouterOutlet) {
    console.info(
      `[app-tree-nav] prepareRoute ${outlet?.activatedRouteData && outlet.activatedRouteData["animation"]}`
    );
    //return this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"];
    return outlet?.activatedRouteData && outlet.activatedRouteData["animation"];
  }
  //menu
  private _transformer = (node: MenuNode, level: number): MenuFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      path: node.path,
      icon: node.icon,
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

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: MenuFlatNode) => node.expandable;
}
