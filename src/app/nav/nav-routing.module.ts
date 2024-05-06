import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { anyRoleGuard } from '../core/guards/roles.guard';
import { NavComponent } from './pages/nav.component';
import { VoidNavComponent } from './pages/void-nav/void-nav.component';

const routes: Routes = [
  {
    path: "navigation",
    component: NavComponent,
    canActivate: [anyRoleGuard],

    data: {
      icon: "navigation",
      roles: ["SPECTATOR"]

    },
    children: [
      {
        path: "void-nav",
        component: VoidNavComponent,
        data: {
          animation: "slideLeft",
          icon: "report_problem",
        },
      },
      {
        path: "nav-forbidden",
        component: VoidNavComponent,
        canActivate: [anyRoleGuard],
        data: {
          animation: "slideLeft",
          icon: "gpp_bad",
          roles: ["ADMIN", "VIEWER"]
        },
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRoutingModule { }
