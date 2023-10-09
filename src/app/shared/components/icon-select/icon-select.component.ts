import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { IconTreeComponent } from "../icon-tree/icon-tree.component";

import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
@Component({
	selector: "app-icon-select",
	templateUrl: "./icon-select.component.html",
	styleUrls: ["./icon-select.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
		MatMenuModule,
		IconTreeComponent,

		MatRippleModule,
		FormsModule,
		MatInputModule,
		MatFormFieldModule,
	],
})
export class IconSelectComponent {
	@Input() value: string | null = null;
	@Output() valueChange = new EventEmitter<string | null>();
	@Input()
	public tooltip: string = "";

	@Input()
	public required = false;

	@Input()
	public disabled = false;

	select(item: string | null) {
		this.value = item === this.value ? null : item;
		this.valueChange.emit(this.value);
	}
	onChange(val: string | null) {
		this.select(val);
	}
}
