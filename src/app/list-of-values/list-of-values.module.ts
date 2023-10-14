import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListOfValuesRoutingModule } from "./list-of-values-routing.module";
import { ListOfValuesComponent } from "./pages/list-of-values.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { MatCardModule } from "@angular/material/card";
import { ValuesComponent } from './pages/values/values.component';

@NgModule({
	declarations: [ListOfValuesComponent, ValuesComponent],
	imports: [
		CommonModule,
		MatCardModule,

		TabsNavComponent,
		ListOfValuesRoutingModule,
	],
})
export class ListOfValuesModule {}
