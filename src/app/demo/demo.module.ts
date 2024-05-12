import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { TranslateModule } from "@ngx-translate/core";

import { TableExpandableRowsComponent } from "../shared/components/table-expandable-rows/table-expandable-rows.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { DemoRoutingModule } from "./demo-routing.module";

import { IconSelectComponent } from "../shared/components/icon-select/icon-select.component";
import { IconTreeComponent } from "../shared/components/icon-tree/icon-tree.component";
import { StickDirective } from "../shared/directives/stick.directive";
import { LocalizedDatePipe } from "../shared/pipes/translation/localized-date.pipe";
import { DemoDatasourceComponent } from "./pages/demo-datasource/demo-datasource.component";
import { DemoExportComponent } from "./pages/demo-export/demo-export.component";
import { DemoI18nComponent } from "./pages/demo-i18n/demo-i18n.component";
import { DemoIconsComponent } from "./pages/demo-icons/demo-icons.component";
import { DemoNotifComponent } from "./pages/demo-notif/demo-notif.component";
import { DemoStickyComponent } from "./pages/demo-sticky/demo-sticky.component";
import { DemoTableComponent } from "./pages/demo-table/demo-table.component";
import { DemoComponent } from "./pages/demo.component";

@NgModule({
  declarations: [
    DemoComponent,
    DemoTableComponent,
    DemoDatasourceComponent,
    DemoExportComponent,
    DemoIconsComponent,
    DemoI18nComponent,
    DemoNotifComponent,
    DemoStickyComponent,
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
    MatRadioModule,
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
    IconTreeComponent,
    IconSelectComponent,
    StickDirective,

    DemoRoutingModule,
  ],
})
export class DemoModule {}
