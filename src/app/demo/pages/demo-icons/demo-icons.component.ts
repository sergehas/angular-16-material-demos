import { Component, ViewEncapsulation } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

//import { IconsService } from "src/app/core/icons/services/icons.service";
@Component({
	selector: "app-demo-icons",
	templateUrl: "./demo-icons.component.html",
	styleUrls: ["./demo-icons.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class DemoIconsComponent {
	//constructor(private service: IconsService) {}
	selected: string | null = "parameter:brands-azure";

	icon = new FormControl('', [Validators.required]);
}
