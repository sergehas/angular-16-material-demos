import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Observable } from "rxjs";
import { GroupsService } from "src/app/core/value-list/services/groups.service";
import { ValuesService } from "src/app/core/value-list/services/values.service";
import { TabsNavComponent } from "../../shared/components/tabs-nav/tabs-nav.component";
import { AsyncPipe } from "@angular/common";
import { MatCard, MatCardImage, MatCardContent } from "@angular/material/card";
import { MatRipple } from "@angular/material/core";

@Component({
  selector: "app-list-of-values",
  templateUrl: "./list-of-values.component.html",
  styleUrls: ["./list-of-values.component.scss"],
  imports: [
    TabsNavComponent,
    MatCard,
    MatRipple,
    RouterLink,
    MatCardImage,
    MatCardContent,
    AsyncPipe,
  ],
})
export class ListOfValuesComponent {
  countGroups$: Observable<number>;
  countValues$: Observable<number>;
  isDashboardActive = true;
  constructor(
    private readonly groupsService: GroupsService,
    private readonly valuesService: ValuesService,
    public router: Router
  ) {
    this.countGroups$ = this.groupsService.count();
    this.countValues$ = this.valuesService.count();
  }
}
