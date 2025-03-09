import { Component, Input } from "@angular/core";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDragHandle,
  moveItemInArray,
} from "@angular/cdk/drag-drop";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import { TableColumn, TableConfig } from "../table-expandable-rows/table-config";

@Component({
    selector: "app-table-config-editor",
    templateUrl: "./table-config-editor.component.html",
    styleUrls: ["./table-config-editor.component.scss"],
    imports: [
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle
]
})
export class TableConfigEditorComponent {
  @Input() options!: TableConfig;
  @Input() maxHeight = "100%";

  /**
   * Predicate function that only allows to sort sticky column XOR non sticky column. doesn't allow to interleave sticky/non sticky .
   * WARNING: `this` is the drop lit, not the component
   */
  sortPredicate(index: number, item: CdkDrag<TableColumn>, drop: CdkDropList): boolean {
    return (
      item.data.sticky === drop.data[index].sticky && item.data.group === drop.data[index].group
    );
  }

  drop(event: CdkDragDrop<TableColumn[]>): void {
    moveItemInArray(this.options.columns.columns, event.previousIndex, event.currentIndex);
  }
  prevent(e: Event) {
    e.stopPropagation();
  }

  toggleSticky(e: Event, col: TableColumn) {
    e.stopPropagation();
    col.sticky = !col.sticky;
  }
  toggleVisibility(e: Event, col: TableColumn) {
    e.stopPropagation();
    col.hidden = !col.hidden;
  }
}
