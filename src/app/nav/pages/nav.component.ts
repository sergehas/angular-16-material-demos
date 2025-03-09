import { Component } from "@angular/core";
import { TabsNavComponent } from "../../shared/components/tabs-nav/tabs-nav.component";

import { MatDivider } from "@angular/material/divider";

@Component({
    selector: "app-nav",
    templateUrl: "./nav.component.html",
    styleUrl: "./nav.component.scss",
    imports: [TabsNavComponent, MatDivider]
})
export class NavComponent {
  isactive = true;
}
