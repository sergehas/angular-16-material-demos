import { NestedTreeControl } from "@angular/cdk/tree";
import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTreeNestedDataSource, MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { Category } from "src/app/core/icons/models/category";
import { IconsService } from "src/app/core/icons/services/icons.service";

@Component({
	selector: "app-icon-tree",
	templateUrl: "./icon-tree.component.html",
	styleUrls: ["./icon-tree.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		MatTreeModule,
		MatIconModule,
		MatButtonModule,
		MatRippleModule,
	],
})
export class IconTreeComponent implements AfterViewInit {
	@Input() value: string | null = null;
	@Output() valueChange = new EventEmitter<string | null>();
	@Input() expanded = false;

	treeControl = new NestedTreeControl<Category>((node) => node.categories);
	dataSource = new MatTreeNestedDataSource<Category>();

	constructor(private service: IconsService) {
		this.dataSource.data = service.getIconslib().categories;
		this.treeControl.dataNodes = this.dataSource.data;
	}
	ngAfterViewInit() {
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

	hasChild = (_: number, node: Category) =>
		!!node.categories && node.categories.length > 0;
}
