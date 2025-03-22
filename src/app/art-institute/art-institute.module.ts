import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ArtInstituteRoutingModule } from "./art-institute-routing.module";
import { ArtInstituteComponent } from "./pages/art-institute.component";
import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";

@NgModule({
  imports: [CommonModule, TabsNavComponent, ArtInstituteRoutingModule, ArtInstituteComponent],
})
export class ArtInstituteModule {}
