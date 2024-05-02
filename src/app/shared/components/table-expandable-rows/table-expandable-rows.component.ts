import {
	AfterViewInit,
	Component,
	Input,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from "@angular/core";
import {
	animate,
	state,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule, DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatRippleModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { MatSort, MatSortModule, MatSortable } from "@angular/material/sort";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { tap } from "rxjs";
import { PageableDataSource } from "src/app/core/models/pageable-data-source";
import { InstanceofPipe } from "../../pipes/instanceof.pipe";
import { TableConfigEditorComponent } from "../table-config-editor/table-config-editor.component";
import { ColumnConfig, TableConfig } from "./table-config";

/**
 * @title Table with expandable rows
 */
@Component({
	selector: "table-expandable-rows",
	styleUrls: ["table-expandable-rows.component.scss"],
	templateUrl: "table-expandable-rows.component.html",
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger("detailExpand", [
			state("collapsed", style({ height: "0px", minHeight: "0" })),
			state("expanded", style({ height: "*" })),
			transition(
				"expanded <=> collapsed",
				animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
			),
		]),
	],
	standalone: true,
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
})
export class TableExpandableRowsComponent<T> implements OnInit, AfterViewInit {
	@Input() dataSource!: PageableDataSource<T>;
	@Input() options?: TableConfig;
	@Input() columnOptions?: ColumnConfig;
	@Input("max-height") maxHeight = "100%";
	@Input("selection") selection?: SelectionModel<T>;

	//for debug
	readonly console = console;
	//for instanceof pipe
	readonly Date = Date;
	private _page: T[] = [];

	get page(): T[] {
		return this._page;
	}

	@ViewChild(MatPaginator) paginator: MatPaginator | undefined;
	// @ViewChild(MatTable) table: MatTable<T> | undefined;
	@ViewChild(MatSort) sort: MatSort | undefined;

	ngOnInit(): void {
		if ((!this.options || !this.options!.columns) && !this.columnOptions) {
			throw "Table must have a config or a column definition";
		}

		//here, we at least have a column config if no options
		this.options =
			this.options ??
			new TableConfig({ name: "", columns: this.columnOptions!.columns });
		//now we had column options, then ensure the columns config is also set
		if (this.columnOptions) {
			this.options.columns = this.columnOptions;
		}
		console.log("options:", this.options);

		//just for debug
		this.dataSource.loading$
			.pipe(tap((b) => console.info(`loading: ${b}`)))
			.subscribe();
		this.dataSource.counting$
			.pipe(tap((b) => console.info(`counting: ${b}`)))
			.subscribe();
	}

	ngAfterViewInit() {
		let ds = this.options!.columns.defaultSort;
		//manage default sort: must be done BEFORE managing events!
		if (this.sort && ds) {
			this.sort.sort({
				id: ds.name,
				start: ds.defaultSort!,
			} as MatSortable);
		}
		this.dataSource.sort = this.sort;
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
		this.dataSource.connect().subscribe((data) => {
			//as data is readonly, we must clone it to be able to set _page
			this._page = data.map((i) => i);
		});
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection!.selected.length;
		const numRows = this._page.length;
		return numSelected === numRows;
	}
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection!.clear();
			return;
		}
		//TODO
		this.selection!.select(...this._page);
	}
}
