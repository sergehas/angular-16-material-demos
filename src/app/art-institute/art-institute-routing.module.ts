import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ArtInstituteComponent } from "./pages/art-institute.component";

const routes: Routes = [
  {
    path: "art-institute",
    component: ArtInstituteComponent,
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
