import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
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
	treeControl = new NestedTreeControl<Category>((node) => node.categories);
	dataSource = new MatTreeNestedDataSource<Category>();

	constructor(private service: IconsService) {
		this.dataSource.data = service.getIconslib().categories;
	}

	hasChild = (_: number, node: Category) =>
		!!node.categories && node.categories.length > 0;
}
