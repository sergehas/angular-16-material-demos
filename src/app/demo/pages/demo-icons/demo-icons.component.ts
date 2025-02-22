import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-demo-icons",
  templateUrl: "./demo-icons.component.html",
  styleUrls: ["./demo-icons.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DemoIconsComponent implements OnInit {
  selected: string | null = "parameter:brands-azure";

  icon = new FormControl("", [Validators.required]);

  ngOnInit(): void {
    this.icon.setValue(this.selected);
  }

}
