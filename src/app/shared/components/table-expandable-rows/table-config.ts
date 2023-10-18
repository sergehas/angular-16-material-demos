//Columns configuration

import { SortDirection } from "@angular/material/sort";

/**
 *
 */
interface TableColumnDef {
	name: string;
	sortable?: boolean;
	defaultSort?: SortDirection;
	sticky?: boolean;
	hidden?: boolean;
	minWidth?: number;
	selector?: boolean;
	group?: string;
}

export class TableColumn implements TableColumnDef {
	name: string;
	sortable?: boolean;
	defaultSort?: SortDirection;
	sticky?: boolean = false;
	hidden?: boolean = false;
	minWidth?: number;
	selector?: boolean;
	group?: string;

	constructor(def: TableColumnDef) {
		this.name = def.name;
		this.sticky = def.sticky ?? false;
		this.defaultSort = def.defaultSort;
		this.sortable =
			this.defaultSort != undefined || (def.sortable ?? false);
		this.hidden = def.hidden ?? false;
		this.minWidth = def.minWidth ?? 0;
		this.selector = def.selector ?? false;
		this.group = def.group ?? "";
	}
}

export class ColumnConfig {
	readonly columns: TableColumn[];
	get names(): string[] {
		return this.columns.map((c) => c.name);
	}

	get defaultSort(): TableColumn | undefined {
		return this.columns.find((c) => c.defaultSort !== undefined);
	}
	constructor(cols: TableColumnDef[]) {
		this.columns = cols.map((c) => new TableColumn(c));
		// this.columns.push({
		// 	name: "action",
		// 	sortable: false,
		// });
	}
	get groups(): string[] {
		let g: string[] = [];
		return this.columns.reduce<string[]>((g: string[], c) => {
			return g.includes(c.group!) ? g : g.concat(c.group!)
		}, g);

	}
}

//Table configuration
interface TableConfigDef {
	name: string;
	responsive?: boolean;
	selector?: boolean;
	stickyHeader?: boolean;
	paginator?: boolean;
	columns?: TableColumnDef[];
}

export class TableConfig {
	name: string;
	responsive: boolean;
	stickyHeader: boolean;
	paginator: boolean;
	columns: ColumnConfig;

	constructor(conf: TableConfigDef) {
		this.name = conf.name;
		this.responsive = conf.responsive ?? true;
		this.stickyHeader = conf.stickyHeader ?? true;
		this.paginator = conf.paginator ?? true;
		this.columns = new ColumnConfig(conf.columns ?? []);
	}
}
