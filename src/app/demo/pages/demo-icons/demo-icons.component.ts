import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDivider } from "@angular/material/divider";

import { MatLabel, MatFormField, MatError, MatHint } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { IconTreeComponent } from "../../../shared/components/icon-tree/icon-tree.component";
import { IconSelectComponent } from "../../../shared/components/icon-select/icon-select.component";

@Component({
    selector: "app-demo-icons",
    templateUrl: "./demo-icons.component.html",
    styleUrls: ["./demo-icons.component.scss"],
    encapsulation: ViewEncapsulation.None,
    imports: [MatDivider, MatLabel, MatIcon, MatButton, IconTreeComponent, IconSelectComponent, MatFormField, FormsModule, ReactiveFormsModule, MatError, MatHint]
})
export class DemoIconsComponent implements OnInit {
  selected: string | null = "parameter:brands-azure";

  icon = new FormControl("", [Validators.required]);

  ngOnInit(): void {
    this.icon.setValue(this.selected);
  }
}
