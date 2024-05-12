import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { NavRoutingModule } from "./nav-routing.module";
import { NavComponent } from "./pages/nav.component";
import { VoidNavComponent } from "./pages/void-nav/void-nav.component";

import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";

@NgModule({
  declarations: [NavComponent, VoidNavComponent],
  imports: [
    TabsNavComponent,
    NavRoutingModule,

    CommonModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatDividerModule,
  ],
})
export class NavModule {}
