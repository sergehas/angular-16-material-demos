import { Component, inject, signal, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTree, MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import { Router, RouterModule } from "@angular/router";
import { MenuNode, NavBuilder } from "@app/shared/components/tabs-nav/models/nav-builder";

@Component({
  selector: "app-tree-nav",
  standalone: true,
  imports: [
    MatIconModule,
    MatTreeModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    MatButtonToggleModule,
  ],
  templateUrl: "./tree-nav.component.html",
  styleUrl: "./tree-nav.component.scss",
})
export class TreeNavComponent {
  private readonly router = inject(Router);
  readonly tree = viewChild.required(MatTree);
  isRail = signal(false);
  dataSource = new MatTreeNestedDataSource<MenuNode>();

  constructor() {
    //menu content
    this.dataSource.data = NavBuilder.buildTree("", this.router.config);
    console.info("[app-tree-nav] menu datasource", this.dataSource.data);
  }

  childrenAccessor = (node: MenuNode) => node.children ?? [];

  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;
}
