import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  {
    path: "art-institute",
    loadComponent: () => import('./pages/art-institute.component').then(m => m.ArtInstituteComponent),
    data: {
      icon: "art_track",
    },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtInstituteRoutingModule {}
