import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  output,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTree, MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import { Category } from "@app/core/icons/models/category";
import { IconsService } from "@app/core/icons/services/icons.service";

@Component({
  selector: "app-icon-tree",
  templateUrl: "./icon-tree.component.html",
  styleUrls: ["./icon-tree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTreeModule, MatIconModule, MatButtonModule, MatRippleModule],
})
export class IconTreeComponent implements AfterViewInit {
  private readonly service = inject(IconsService);

  readonly value = model<string | null>(null);
  readonly valueChange = output<string | null>();
  readonly expanded = model<boolean>(true);

  readonly tree = viewChild.required(MatTree);
  dataSource = new MatTreeNestedDataSource<Category>();

  constructor() {
    const lib = this.service.getIconsLib();
    if (lib?.categories) {
      this.dataSource.data = lib.categories;
    }
    effect(() => {
      if (this.expanded()) {
        this.tree().expandAll();
      } else {
        this.tree().collapseAll();
      }
    });
  }

  ngAfterViewInit(): void {
    // mandatory as tree is not initialized when the initial state is set.
    if (this.expanded()) {
      this.tree().expandAll();
    } else {
      this.tree().collapseAll();
    }
  }
  /**
   * toggle selected item
   */
  select(item: string) {
    this.value.set(item === this.value() ? null : item);
    this.valueChange.emit(this.value());
  }

  childrenAccessor = (node: Category) => node.categories ?? [];

  hasChild = (_: number, node: Category) => !!node.categories && node.categories.length > 0;
}
