import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GroupsComponent } from "./pages/groups/groups.component";
import { ListOfValuesComponent } from "./pages/list-of-values.component";

const routes: Routes = [
  {
    path: "list-of-values",
    component: ListOfValuesComponent,
    data: {
      icon: "engineering",
      animation: "slideTop",
    },
    children: [
      // list "sub" pages from this demo feature components
      {
        path: "groups",
        component: GroupsComponent,
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
