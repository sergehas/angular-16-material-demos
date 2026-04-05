import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule, DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
  input,
  model,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule, MatSortable } from "@angular/material/sort";

import {
  DatasourceError,
  PageableDataSource,
} from "@app/core/datasources/models/pageable-data-source";
import { TableConfigEditorComponent } from "@app/shared/components/table-config-editor/table-config-editor.component";
import {
  ColumnConfig,
  TableConfig,
} from "@app/shared/components/table-expandable-rows/table-config";
import { InstanceofPipe } from "@app/shared/pipes/instanceof.pipe";
import { tap } from "rxjs";

/**
 * @title Table with expandable rows
 */
@Component({
  selector: "app-table-expandable-rows",
  styleUrls: ["table-expandable-rows.component.scss"],
  templateUrl: "table-expandable-rows.component.html",
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatRippleModule,
    MatMenuModule,
    MatCheckboxModule,
    TableConfigEditorComponent,
    InstanceofPipe,
    DatePipe,
  ],
}) /* extends MatTable<T> */
export class TableExpandableRowsComponent<T> implements OnInit, AfterViewInit {
  readonly dataSource = input.required<PageableDataSource<T>>();
  readonly options = model<TableConfig>();
  readonly columnOptions = input<ColumnConfig>();
  readonly maxHeight = input("100%");
  readonly selection = input<SelectionModel<T>>();

  //for instanceof pipe
  readonly Date = Date;
  private _page: T[] = [];

  get page(): T[] {
    return this._page;
  }

  readonly paginator = viewChild(MatPaginator);
  // @ViewChild(MatTable) table: MatTable<T> | undefined;
  readonly sort = viewChild(MatSort);

  ngOnInit(): void {
    const columnOptions = this.columnOptions();
    let options = this.options();
    if (!options?.columns && !columnOptions) {
      throw new Error("Table must have a config or a column definition");
    }

    //here, we at least have a column config if no options
    options = options ?? new TableConfig({ name: "", columns: columnOptions!.columns });
    //now we had column options, then ensure the columns config is also set
    if (columnOptions) {
      options.columns = columnOptions;
    }
    this.options.set(options);

    console.log("[table-expandable-rows] options:", options);

    //just for debug
    this.dataSource()
      .loading$.pipe(tap((b) => console.info(`[table-expandable-rows] loading: ${b}`)))
      .subscribe();
    this.dataSource()
      .counting$.pipe(tap((b) => console.info(`[table-expandable-rows] counting: ${b}`)))
      .subscribe();
  }

  ngAfterViewInit() {
    const ds = this.options()!.columns.defaultSort;
    //manage default sort: must be done BEFORE managing events!
    const sort = this.sort();
    if (sort && ds) {
      sort.sort({
        id: ds.name,
        start: ds.defaultSort!,
      } as MatSortable);
    }
    const dataSource = this.dataSource();
    dataSource.sort = sort;
    const paginator = this.paginator();
    if (paginator) {
      dataSource.paginator = paginator;
    }
    dataSource.connect().subscribe((data) => {
      //as data is readonly, we must clone it to be able to set _page
      this._page = data.map((i) => i);
    });
  }

  isError(m: boolean | DatasourceError): boolean {
    return m instanceof DatasourceError;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection()!.selected.length;
    const numRows = this._page.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection()!.clear();
      return;
    }
    //TODO
    this.selection()!.select(...this._page);
  }
}
