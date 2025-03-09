import { Component } from "@angular/core";
import { TabsNavComponent } from "../../shared/components/tabs-nav/tabs-nav.component";

@Component({
    selector: "app-demo",
    templateUrl: "./demo.component.html",
    styleUrls: ["./demo.component.scss"],
    imports: [TabsNavComponent]
})
export class DemoComponent {}
