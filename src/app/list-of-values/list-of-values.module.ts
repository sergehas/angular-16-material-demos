import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListOfValuesRoutingModule } from "./list-of-values-routing.module";
import { ListOfValuesComponent } from "./pages/list-of-values.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { MatCardModule } from "@angular/material/card";
import { ValuesComponent } from "./pages/values/values.component";
import { GroupsComponent } from "./pages/groups/groups.component";
import { MatRippleModule } from "@angular/material/core";

@NgModule({
	declarations: [ListOfValuesComponent, ValuesComponent, GroupsComponent],
	imports: [
		CommonModule,
		MatCardModule,
		MatRippleModule,

		TabsNavComponent,
		ListOfValuesRoutingModule,
	],
})
export class ListOfValuesModule {}
