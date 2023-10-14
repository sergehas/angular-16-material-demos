import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListOfValuesRoutingModule } from "./list-of-values-routing.module";
import { ListOfValuesComponent } from "./pages/list-of-values.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";

@NgModule({
	declarations: [ListOfValuesComponent],
	imports: [CommonModule, TabsNavComponent, ListOfValuesRoutingModule],
})
export class ListOfValuesModule {}
