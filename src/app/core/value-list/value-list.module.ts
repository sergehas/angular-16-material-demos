import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GroupsService } from "@app/core/value-list/services/groups.service";
import { ValuesService } from "@app/core/value-list/services/values.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [GroupsService, ValuesService],
})
export class ValueListModule {}
