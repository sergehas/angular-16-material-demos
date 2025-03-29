import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";









const routes: Routes = [
  {
    path: "demo",
    loadComponent: () => import('./pages/demo.component').then(m => m.DemoComponent),
    data: {
      icon: "preview",
    },
    children: [
      // list "sub" pages from this demo feature components
      {
        path: "demo-table",
        loadComponent: () => import('./pages/demo-table/demo-table.component').then(m => m.DemoTableComponent),
        data: {
          animation: "tabSlide",
          icon: "table",
        },
      },
      {
        path: "demo-datasource",
        loadComponent: () => import('./pages/demo-datasource/demo-datasource.component').then(m => m.DemoDatasourceComponent),
        data: {
          animation: "tabSlide",
          icon: "dataset",
        },
      },
      {
        path: "demo-export",
        loadComponent: () => import('./pages/demo-export/demo-export.component').then(m => m.DemoExportComponent),
        data: {
          animation: "tabSlide",
          icon: "download",
        },
      },
      {
        path: "demo-icons",
        loadComponent: () => import('./pages/demo-icons/demo-icons.component').then(m => m.DemoIconsComponent),
        data: {
          animation: "tabSlide",
          icon: "imagemode",
        },
      },
      {
        path: "demo-i18n",
        loadComponent: () => import('./pages/demo-i18n/demo-i18n.component').then(m => m.DemoI18nComponent),
        data: {
          animation: "tabSlide",
          icon: "translate",
        },
      },
      {
        path: "demo-notif",
        loadComponent: () => import('./pages/demo-notif/demo-notif.component').then(m => m.DemoNotifComponent),
        data: {
          animation: "tabSlide",
          icon: "notifications",
        },
      },
      {
        path: "demo-sticky",
        loadComponent: () => import('./pages/demo-sticky/demo-sticky.component').then(m => m.DemoStickyComponent),
        data: {
          animation: "tabSlide",
          icon: "title",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule {}
