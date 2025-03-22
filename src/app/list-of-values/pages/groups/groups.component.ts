import { Component, ViewChild, inject } from "@angular/core";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription,
} from "@angular/material/expansion";
import { Observable } from "rxjs";
import { Group } from "src/app/core/value-list/models/group";
import { GroupsService } from "src/app/core/value-list/services/groups.service";
import { AsyncPipe } from "@angular/common";
import { ValuesComponent } from "../values/values.component";

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.scss"],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    ValuesComponent,
    AsyncPipe,
  ],
})
export class GroupsComponent {
  private readonly groupsService = inject(GroupsService);

  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  groups$: Observable<Group[]>;

  constructor() {
    this.groups$ = this.groupsService.find(undefined, undefined, undefined);
  }
}
