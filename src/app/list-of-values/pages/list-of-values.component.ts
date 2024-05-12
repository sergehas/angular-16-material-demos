import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { GroupsService } from "src/app/core/value-list/services/groups.service";
import { ValuesService } from "src/app/core/value-list/services/values.service";

@Component({
  selector: "app-list-of-values",
  templateUrl: "./list-of-values.component.html",
  styleUrls: ["./list-of-values.component.scss"],
})
export class ListOfValuesComponent {
  countGroups$: Observable<number>;
  countValues$: Observable<number>;
  isDashboardActive = true;
  constructor(
    private groupsService: GroupsService,
    private valuesService: ValuesService,
    public router: Router
  ) {
    this.countGroups$ = this.groupsService.count();
    this.countValues$ = this.valuesService.count();
  }
}
