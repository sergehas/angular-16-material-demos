import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTreeNestedDataSource, MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { Category } from "src/app/core/icons/models/category";
import { IconsService } from "src/app/core/icons/services/icons.service";

@Component({
	selector: "app-icon-select",
	templateUrl: "./icon-select.component.html",
	styleUrls: ["./icon-select.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		MatTreeModule,
		MatIconModule,
		MatButtonModule,
		MatRippleModule,
	],
})
export class IconSelectComponent {
	@Input() value: string | null = null;
	@Output() valueChange = new EventEmitter<string | null>();

	treeControl = new NestedTreeControl<Category>((node) => node.categories);
	dataSource = new MatTreeNestedDataSource<Category>();

	constructor(private service: IconsService) {
		this.dataSource.data = service.getIconslib().categories;
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
