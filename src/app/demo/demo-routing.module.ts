import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DemoComponent } from "./pages/demo.component";
import { DemoTableComponent } from "./pages/demo-table/demo-table.component";
import { DemoDatasourceComponent } from "./pages/demo-datasource/demo-datasource.component";

const routes: Routes = [
	{
		path: "demo",
		component: DemoComponent,
		children: [
			// list "sub" pages from this demo feature components
			{
				path: "demo-table",
				component: DemoTableComponent,
			},
			{
				path: "demo-datasource",
				component: DemoDatasourceComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DemoRoutingModule {}
