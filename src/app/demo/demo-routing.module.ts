import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DemoComponent } from "./pages/demo.component";
import { DemoTableComponent } from "./pages/demo-table/demo-table.component";
import { DemoDatasourceComponent } from "./pages/demo-datasource/demo-datasource.component";

const routes: Routes = [
	{
		path: "demo",
		component: DemoComponent,
		data: { animation: "slideLeft" },
		children: [
			// list "sub" pages from this demo feature components
			{
				path: "demo-table",
				component: DemoTableComponent,
				data: { animation: "slideRight" },
			},
			{
				path: "demo-datasource",
				component: DemoDatasourceComponent,
				data: { animation: "slideLeft" },
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DemoRoutingModule {}
