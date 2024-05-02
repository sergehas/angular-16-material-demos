import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DemoDatasourceComponent } from "./pages/demo-datasource/demo-datasource.component";
import { DemoExportComponent } from "./pages/demo-export/demo-export.component";
import { DemoI18nComponent } from "./pages/demo-i18n/demo-i18n.component";
import { DemoIconsComponent } from "./pages/demo-icons/demo-icons.component";
import { DemoNotifComponent } from "./pages/demo-notif/demo-notif.component";
import { DemoStickyComponent } from "./pages/demo-sticky/demo-sticky.component";
import { DemoTableComponent } from "./pages/demo-table/demo-table.component";
import { DemoComponent } from "./pages/demo.component";

const routes: Routes = [
	{
		path: "demo",
		component: DemoComponent,
		data: {
			animation: "slideLeft",
			icon: "preview"
		},
		children: [
			// list "sub" pages from this demo feature components
			{
				path: "demo-table",
				component: DemoTableComponent,
				data: {
					animation: "slideLeft",
					icon: "table"
				},
			},
			{
				path: "demo-datasource",
				component: DemoDatasourceComponent,
				data: {
					animation: "slideLeft",
					icon: "dataset"
				},
			},
			{
				path: "demo-export",
				component: DemoExportComponent,
				data: {
					animation: "slideLeft",
					icon: "download"
				},
			},
			{
				path: "demo-icons",
				component: DemoIconsComponent,
				data: {
					animation: "slideLeft",
					icon: "imagemode"
				},
			},
			{
				path: "demo-i18n",
				component: DemoI18nComponent,
				data: {
					animation: "slideLeft",
					icon: "translate"
				},
			},
			{
				path: "demo-notif",
				component: DemoNotifComponent,
				data: {
					animation: "slideLeft",
					icon: "notifications"
				},
			},
			{
				path: "demo-sticky",
				component: DemoStickyComponent,
				data: {
					animation: "slideLeft",
					icon: "title"
				},
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DemoRoutingModule { }
