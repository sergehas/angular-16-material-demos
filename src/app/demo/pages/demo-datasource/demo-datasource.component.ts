import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { BehaviorSubject, Subscription, map, merge } from "rxjs";
import { Issue } from "src/app/core/github/models/issue";

import { GithubService } from "src/app/core/github/services/github.service";
import { DatasourceError, PageableDataSource } from "src/app/core/models/pageable-data-source";
import { MatDivider } from "@angular/material/divider";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel, MatHint } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from "@angular/material/table";
import { MatBadge } from "@angular/material/badge";
import { AsyncPipe, DatePipe } from "@angular/common";

@Component({
  selector: "app-demo-datasource",
  templateUrl: "./demo-datasource.component.html",
  styleUrls: ["./demo-datasource.component.scss"],
  imports: [
    MatDivider,
    MatSlideToggle,
    FormsModule,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatHint,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatSortHeader,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    MatBadge,
    AsyncPipe,
    DatePipe,
  ],
})
export class DemoDatasourceComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: PageableDataSource<Issue>;
  displayedColumns: string[] = ["created", "state", "number", "title"];
  dataSourceEvents$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  // demo purpose features
  paginatorEnabled = true;
  sortEnabled = true;
  autoloadEnabled = false;
  filter = new FormControl("");
  private _sub?: Subscription;

  constructor(private readonly service: GithubService) {
    this.dataSource = new PageableDataSource<Issue>(this.service, this.autoloadEnabled);
  }

  setFilter() {
    this.dataSource.filter = {
      query: this.filter.value ? this.filter.value : "",
    };
  }

  private _setDatasource() {
    console.info("[demo datasource] setting datasource");
    this._sub = merge(
      this.dataSource.loading$.pipe(
        map((b) => {
          if (b instanceof DatasourceError) {
            return `datasource loading: ERROR (${b.message})`;
          }

          return `datasource loading: ${b}`;
        })
      ),
      this.dataSource.counting$.pipe(
        map((b) => {
          if (b instanceof Error) {
            return `datasource counting: ERROR (${b.message})`;
          }
          return `datasource  counting: ${b}`;
        })
      ),
      this.dataSource.error$.pipe(
        map((b) => {
          return `datasource error: ${b}`;
        })
      )
    ).subscribe((e) => {
      console.info("[demo datasource] event received", e);
      this.dataSourceEvents$.value.push(`[${new Date().toISOString()}]: ${e}`);
    });
    //manage default sort: must be done BEFORE managing events!
    if (this.sortEnabled) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginatorEnabled) {
      this.dataSource.paginator = this.paginator;
    }
  }

  resetDatasource() {
    console.info("resetting datasource");
    this._sub?.unsubscribe();
    this.filter.setValue(null);
    this.dataSource = new PageableDataSource<Issue>(this.service, this.autoloadEnabled);
    this._setDatasource();
  }

  ngAfterViewInit(): void {
    this._setDatasource();
  }
}
