import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { GroupsService } from "src/app/core/value-list/services/groups.service";

@Component({
	selector: "app-list-of-values",
	templateUrl: "./list-of-values.component.html",
	styleUrls: ["./list-of-values.component.scss"],
})
export class ListOfValuesComponent {
	count$: Observable<number>;
	constructor(private service: GroupsService) {
		this.count$ = this.service.count();
	}
}
