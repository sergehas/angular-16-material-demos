import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDivider } from "@angular/material/divider";

import { MatButton } from "@angular/material/button";
import { MatError, MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { IconSelectComponent } from "../../../shared/components/icon-select/icon-select.component";
import { IconTreeComponent } from "../../../shared/components/icon-tree/icon-tree.component";

@Component({
  selector: "app-demo-icons",
  templateUrl: "./demo-icons.component.html",
  styleUrls: ["./demo-icons.component.scss"],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatDivider,
    MatLabel,
    MatIcon,
    MatButton,
    IconTreeComponent,
    IconSelectComponent,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatError,
    MatHint,
  ],
})
export class DemoIconsComponent implements OnInit {
  selected: string | null = "parameter:brands-azure";

  icon = new FormControl("", [Validators.required]);

  ngOnInit(): void {
    this.icon.setValue(this.selected);
  }
}
