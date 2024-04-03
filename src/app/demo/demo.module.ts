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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSliderModule } from "@angular/material/slider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

import { TranslateModule } from "@ngx-translate/core";

import { DemoRoutingModule } from "./demo-routing.module";
import { TableExpandableRowsComponent } from "../shared/components/table-expandable-rows/table-expandable-rows.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { IconSelectComponent } from "../shared/components/icon-select/icon-select.component";
import { IconTreeComponent } from "../shared/components/icon-tree/icon-tree.component";

import { DemoComponent } from "./pages/demo.component";
import { DemoTableComponent } from "./pages/demo-table/demo-table.component";
import { DemoDatasourceComponent } from "./pages/demo-datasource/demo-datasource.component";
import { VoidNavComponent } from "./pages/void-nav/void-nav.component";
import { DemoIconsComponent } from "./pages/demo-icons/demo-icons.component";
import { DemoI18nComponent } from "./pages/demo-i18n/demo-i18n.component";
import { DemoExportComponent } from "./pages/demo-export/demo-export.component";
import { LocalizedDatePipe } from "../shared/pipes/translation/localized-date.pipe";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
	declarations: [
		DemoComponent,
		DemoTableComponent,
		DemoDatasourceComponent,
		DemoExportComponent,
		VoidNavComponent,
		DemoIconsComponent,
		DemoI18nComponent,
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
		MatDatepickerModule,
		ReactiveFormsModule,
		MatSelectModule,

		TranslateModule,
		LocalizedDatePipe,

		TabsNavComponent,
		TableExpandableRowsComponent,
		IconSelectComponent,
		IconTreeComponent,

		DemoRoutingModule,
	],
})
export class DemoModule {}
