import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListOfValuesRoutingModule } from "./list-of-values-routing.module";
import { ListOfValuesComponent } from "./pages/list-of-values.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";

import { ValueEditDialog, ValuesComponent } from "./pages/values/values.component";
import { GroupsComponent } from "./pages/groups/groups.component";

import { MatCardModule } from "@angular/material/card";
import { MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IconSelectComponent } from "../shared/components/icon-select/icon-select.component";

@NgModule({
	declarations: [ListOfValuesComponent, ValuesComponent, GroupsComponent, ValueEditDialog],
	imports: [
		CommonModule,
		MatCardModule,
		MatRippleModule,
		MatExpansionModule,
		MatPaginatorModule,
		MatSortModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		FormsModule,
		MatFormFieldModule,
		MatDialogModule, 
		ReactiveFormsModule,
		
		TabsNavComponent,
		ListOfValuesRoutingModule,
		IconSelectComponent
	],
})
export class ListOfValuesModule {}
