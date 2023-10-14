import { Component } from "@angular/core";
import { GroupsService } from "src/app/core/value-list/services/groups.service";

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"],
})
export class GroupsComponent {
	constructor(private groupsService: GroupsService) {}
}
