import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListOfValuesComponent } from "./pages/list-of-values.component";

const routes: Routes = [
	{
		path: "list-of-values",
		component: ListOfValuesComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ListOfValuesRoutingModule {}
