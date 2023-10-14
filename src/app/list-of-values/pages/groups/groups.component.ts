import { Component, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { Observable } from "rxjs";
import { Group } from "src/app/core/value-list/models/group";
import { GroupsService } from "src/app/core/value-list/services/groups.service";

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"],
})
export class GroupsComponent {
	@ViewChild(MatAccordion) accordion: MatAccordion | undefined;

	groups$: Observable<Group[]>;

	constructor(private groupsService: GroupsService) {
		this.groups$ = this.groupsService.find(undefined, undefined, undefined);
	}
}
