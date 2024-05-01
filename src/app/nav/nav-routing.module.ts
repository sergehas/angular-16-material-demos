import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { anyRoleGuard } from '../shared/guards/any-role.guard';
import { NavComponent } from './pages/nav.component';
import { VoidNavComponent } from './pages/void-nav/void-nav.component';

const routes: Routes = [
  {
    path: "navigation",
    component: NavComponent,
    children: [
      {
        path: "void-nav",
        component: VoidNavComponent,
        data: { animation: "slideLeft" },
      },
      {
        path: "nav-forbidden",
        component: VoidNavComponent,
        canActivate: [anyRoleGuard],
        data: {
          animation: "slideLeft",
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