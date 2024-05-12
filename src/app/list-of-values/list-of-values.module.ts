import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TabsNavComponent } from "../shared/components/tabs-nav/tabs-nav.component";
import { ListOfValuesRoutingModule } from "./list-of-values-routing.module";
import { ListOfValuesComponent } from "./pages/list-of-values.component";

import { GroupsComponent } from "./pages/groups/groups.component";
import {
  ValueEditDialog,
  ValuesComponent,
} from "./pages/values/values.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { IconSelectComponent } from "../shared/components/icon-select/icon-select.component";

@NgModule({
  declarations: [
    ListOfValuesComponent,
    ValuesComponent,
    GroupsComponent,
    ValueEditDialog,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatRippleModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,

    TabsNavComponent,
    IconSelectComponent,

    ListOfValuesRoutingModule,
  ],
})
export class ListOfValuesModule {}
