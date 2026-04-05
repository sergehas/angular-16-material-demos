import { Component } from "@angular/core";
import { MatDivider } from "@angular/material/divider";
import { StickDirective } from "@app/shared/directives/stick.directive";

@Component({
  selector: "app-demo-sticky",
  templateUrl: "./demo-sticky.component.html",
  styleUrl: "./demo-sticky.component.scss",
  imports: [StickDirective, MatDivider],
})
export class DemoStickyComponent {}
