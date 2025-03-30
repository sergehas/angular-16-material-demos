import { Component } from "@angular/core";
import { StickDirective } from "../../../shared/directives/stick.directive";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: "app-demo-sticky",
  templateUrl: "./demo-sticky.component.html",
  styleUrl: "./demo-sticky.component.scss",
  imports: [StickDirective, MatDivider],
})
export class DemoStickyComponent {}
