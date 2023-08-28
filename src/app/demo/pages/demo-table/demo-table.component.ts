import { SelectionModel } from "@angular/cdk/collections";
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewEncapsulation,
} from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { Issue } from "src/app/core/github/models/issue";
import { GithubService } from "src/app/core/github/services/github.service";
import { PageableDataSource } from "src/app/core/models/pageable-data-source";
import { TableConfig } from "src/app/shared/components/table-expandable-rows/table-config";

@Component({
	selector: "app-demo-table",
	templateUrl: "./demo-table.component.html",
	styleUrls: ["./demo-table.component.scss"],
	encapsulation: ViewEncapsulation.None,

	//required as nested component uses observable in html
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTableComponent implements OnInit {
	dataSource!: PageableDataSource<Issue>;
	options: TableConfig = new TableConfig({
		name: "",
		responsive: true,
		columns: [
			{ name: "select", sticky: true, selector: true },
			{ name: "number", sticky: true },
			{ name: "title" },
			{ name: "state" },
			{ name: "created", defaultSort: "asc" },
		],
	});

	selection = new SelectionModel<Issue>(true, []);

	constructor(private service: GithubService) {
		this.dataSource = new PageableDataSource<Issue>(this.service);
	}

	ngOnInit(): void {}
}
