import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListOfValuesComponent } from "./pages/list-of-values.component";
import { ValuesComponent } from "./pages/values/values.component";

const routes: Routes = [
	{
		path: "list-of-values",
		component: ListOfValuesComponent,
		children: [
			// list "sub" pages from this demo feature components
			{
				path: "values",
				component: ValuesComponent,
				data: { animation: "slideRight" },
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ListOfValuesRoutingModule {}
