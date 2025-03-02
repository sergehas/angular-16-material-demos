import { NestedTreeControl } from "@angular/cdk/tree";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, MatButtonModule, MatRippleModule],
})
export class IconTreeComponent implements OnInit {
  @Input() value: string | null = null;
  @Output() valueChange = new EventEmitter<string | null>();
  @Input() expanded = false;

  treeControl = new NestedTreeControl<Category>((node) => node.categories);
  dataSource = new MatTreeNestedDataSource<Category>();

  constructor(private readonly service: IconsService) {
    this.dataSource.data = this.service.getIconslib().categories;
    this.treeControl.dataNodes = this.dataSource.data;
  }
  ngOnInit() {
    if (this.expanded) {
      this.treeControl.expandAll();
    }
  }
  /**
   * toggle selected item
   */
  select(item: string) {
    this.value = item === this.value ? null : item;
    this.valueChange.emit(this.value);
  }

  hasChild = (_: number, node: Category) => !!node.categories && node.categories.length > 0;
}
