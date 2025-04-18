import { NestedTreeControl } from "@angular/cdk/tree";

import { Component, OnInit, inject, input, model, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import { Category } from "src/app/core/icons/models/category";
import { IconsService } from "src/app/core/icons/services/icons.service";

@Component({
  selector: "app-icon-tree",
  templateUrl: "./icon-tree.component.html",
  styleUrls: ["./icon-tree.component.scss"],
  imports: [MatTreeModule, MatIconModule, MatButtonModule, MatRippleModule],
})
export class IconTreeComponent implements OnInit {
  private readonly service = inject(IconsService);

  readonly value = model<string | null>(null);
  readonly valueChange = output<string | null>();
  readonly expanded = input(false);

  treeControl = new NestedTreeControl<Category>((node) => node.categories);
  dataSource = new MatTreeNestedDataSource<Category>();

  constructor() {
    this.dataSource.data = this.service.getIconsLib().categories;
    this.treeControl.dataNodes = this.dataSource.data;
  }
  ngOnInit() {
    if (this.expanded()) {
      this.treeControl.expandAll();
    }
  }
  /**
   * toggle selected item
   */
  select(item: string) {
    this.value.set(item === this.value() ? null : item);
    this.valueChange.emit(this.value());
  }

  hasChild = (_: number, node: Category) => !!node.categories && node.categories.length > 0;
}
