import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { Issue } from "src/app/core/github/models/issue";
import { GithubService } from "src/app/core/github/services/github.service";
import { PageableDataSource } from "src/app/core/models/pageable-data-source";
import { TableConfig } from "src/app/shared/components/table-expandable-rows/table-config";
import { MatDivider } from "@angular/material/divider";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";
import { TableExpandableRowsComponent } from "../../../shared/components/table-expandable-rows/table-expandable-rows.component";

@Component({
  selector: "app-demo-table",
  templateUrl: "./demo-table.component.html",
  styleUrls: ["./demo-table.component.scss"],
  encapsulation: ViewEncapsulation.None,
  //required as nested component uses observable in html
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDivider,
    MatSlideToggle,
    FormsModule,
    MatSlider,
    MatSliderThumb,
    TableExpandableRowsComponent,
  ],
})
export class DemoTableComponent {
  dataSource!: PageableDataSource<Issue>;
  options: TableConfig = new TableConfig({
    paginator: true,
    name: "",
    responsive: true,
    columns: [
      { name: "select", sticky: true, selector: true, group: "UI feature" },
      { name: "number", sticky: true, group: "Issue" },
      { name: "title", group: "Issue" },
      { name: "state", group: "Issue" },
      { name: "created", defaultSort: "asc", hidden: true, group: "Meta" },
    ],
  });

  selection = new SelectionModel<Issue>(true, []);

  constructor(private readonly service: GithubService) {
    this.dataSource = new PageableDataSource<Issue>(this.service);
  }
}
