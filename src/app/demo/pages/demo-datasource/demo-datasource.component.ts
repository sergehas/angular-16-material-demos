import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, merge } from "rxjs";
import { Issue } from "src/app/core/github/models/issue";

import { GithubService } from "src/app/core/github/services/github.service";
import { PageableDataSource } from "src/app/core/models/pageable-data-source";

@Component({
	selector: "app-demo-datasource",
	templateUrl: "./demo-datasource.component.html",
	styleUrls: ["./demo-datasource.component.scss"],
})
export class DemoDatasourceComponent implements AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator | undefined;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource!: PageableDataSource<Issue>;
	displayedColumns: string[] = ["created", "state", "number", "title"];
	dataSourceEvents: string[] = [];
	// demo purpose features
	paginatorEnabled = true;
	sortEnabled = true;

	constructor(private service: GithubService) {
		this.dataSource = new PageableDataSource<Issue>(this.service);
	}

	ngAfterViewInit() {
		merge(
			this.dataSource.loading$.pipe(
				map((b) => `datasource loading: ${b}`)
			),
			this.dataSource.counting$.pipe(
				map((b) => `datasource  counting: ${b}`)
			)
		).subscribe((e) =>
			this.dataSourceEvents.push(`[${new Date().toISOString()}]: ${e}`)
		);

		//manage default sort: must be done BEFORE managing events!
		if (this.sortEnabled) {
			this.dataSource.sort = this.sort;
		}
		if (this.paginatorEnabled) {
			this.dataSource.paginator = this.paginator;
		}
	}
}
