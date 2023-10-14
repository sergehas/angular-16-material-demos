import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListOfValuesRoutingModule } from "./list-of-values-routing.module";
import { ListOfValuesComponent } from "./pages/list-of-values.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { MatCardModule } from "@angular/material/card";
import { MatRippleModule } from "@angular/material/core";
import {MatExpansionModule} from '@angular/material/expansion';

import { ValuesComponent } from "./pages/values/values.component";
import { GroupsComponent } from "./pages/groups/groups.component";

@NgModule({
	declarations: [ListOfValuesComponent, ValuesComponent, GroupsComponent],
	imports: [
		CommonModule,
		MatCardModule,
		MatRippleModule,
		MatExpansionModule,

		TabsNavComponent,
		ListOfValuesRoutingModule,
	],
})
export class ListOfValuesModule {}
