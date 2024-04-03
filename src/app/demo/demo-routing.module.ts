import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DemoComponent } from "./pages/demo.component";
import { DemoTableComponent } from "./pages/demo-table/demo-table.component";
import { DemoDatasourceComponent } from "./pages/demo-datasource/demo-datasource.component";
import { VoidNavComponent } from "./pages/void-nav/void-nav.component";
import { DemoIconsComponent } from "./pages/demo-icons/demo-icons.component";
import { DemoI18nComponent } from "./pages/demo-i18n/demo-i18n.component";
import { DemoExportComponent } from "./pages/demo-export/demo-export.component";

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
			{
				path: "demo-export",
				component: DemoExportComponent,
				data: { animation: "slideLeft" },
			},
			{
				path: "demo-icons",
				component: DemoIconsComponent,
				data: { animation: "slideLeft" },
			},
			{
				path: "demo-i18n",
				component: DemoI18nComponent,
				data: { animation: "slideRight" },
			},
		],
	},
	{
		path: "void-nav",
		component: VoidNavComponent,
		data: { animation: "slideLeft" },
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DemoRoutingModule {}
