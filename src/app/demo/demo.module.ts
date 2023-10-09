import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSliderModule } from "@angular/material/slider";

import { DemoRoutingModule } from "./demo-routing.module";
import { TableExpandableRowsComponent } from "../shared/components/table-expandable-rows/table-expandable-rows.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { IconSelectComponent } from "../shared/components/icon-select/icon-select.component";

import { DemoComponent } from "./pages/demo.component";
import { DemoTableComponent } from "./pages/demo-table/demo-table.component";
import { DemoDatasourceComponent } from "./pages/demo-datasource/demo-datasource.component";
import { VoidNavComponent } from "./pages/void-nav/void-nav.component";
import { DemoIconsComponent } from "./pages/demo-icons/demo-icons.component";

@NgModule({
	declarations: [
		DemoComponent,
		DemoTableComponent,
		DemoDatasourceComponent,
		VoidNavComponent,
		DemoIconsComponent,
	],
	imports: [
		CommonModule,
		MatProgressBarModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatIconModule,
		MatButtonModule,
		MatBadgeModule,
		MatDividerModule,
		FormsModule,
		MatSlideToggleModule,
		MatInputModule,
		MatFormFieldModule,
		MatSliderModule,

		TabsNavComponent,
		TableExpandableRowsComponent,
		IconSelectComponent,

		DemoRoutingModule,
	],
})
export class DemoModule {}
