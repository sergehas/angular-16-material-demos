import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListOfValuesComponent } from "./pages/list-of-values.component";
import { GroupsComponent } from "./pages/groups/groups.component";

const routes: Routes = [
	{
		path: "list-of-values",
		component: ListOfValuesComponent,
		data: { animation: "slideRight" },
		children: [
			// list "sub" pages from this demo feature components
			{
				path: "groups",
				component: GroupsComponent,
				data: { animation: "slideLeft" },
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ListOfValuesRoutingModule {}
