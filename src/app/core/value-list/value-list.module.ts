import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GroupsService } from "./services/groups.service";
import { ValuesService } from "./services/values.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [GroupsService, ValuesService],
})
export class ValueListModule {}
