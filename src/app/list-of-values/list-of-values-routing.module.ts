import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";



const routes: Routes = [
  {
    path: "list-of-values",
    loadComponent: () => import('./pages/list-of-values.component').then(m => m.ListOfValuesComponent),
    data: {
      icon: "engineering",
      animation: "slideTop",
    },
    children: [
      // list "sub" pages from this demo feature components
      {
        path: "groups",
        loadComponent: () => import('./pages/groups/groups.component').then(m => m.GroupsComponent),
        data: {
          animation: "slideTab",
          icon: "settings",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListOfValuesRoutingModule {}
