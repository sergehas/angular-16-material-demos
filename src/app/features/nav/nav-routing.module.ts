import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { allRoleGuard, anyRoleGuard } from "@app/core/guards/roles.guard";

const routes: Routes = [
  {
    path: "navigation",
    loadComponent: () => import("./pages/nav.component").then((m) => m.NavComponent),
    canActivate: [anyRoleGuard],

    data: {
      icon: "navigation",
      roles: ["SPECTATOR"],
    },
    children: [
      {
        path: "void-nav",
        loadComponent: () =>
          import("./pages/void-nav/void-nav.component").then((m) => m.VoidNavComponent),
        data: {
          animation: "h-slide",
          icon: "report_problem",
        },
      },
      {
        path: "nav-forbidden",
        loadComponent: () =>
          import("./pages/void-nav/void-nav.component").then((m) => m.VoidNavComponent),
        canActivate: [allRoleGuard],
        data: {
          animation: "h-slide",
          icon: "gpp_bad",
          roles: ["ADMIN", "VIEWER"],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavRoutingModule {}
