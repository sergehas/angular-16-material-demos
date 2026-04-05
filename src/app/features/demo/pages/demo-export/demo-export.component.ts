import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatBadge } from "@angular/material/badge";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatDivider } from "@angular/material/divider";
import { MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatProgressBar, ProgressBarMode } from "@angular/material/progress-bar";
import { MatSelect } from "@angular/material/select";
import { PageableDataSource, Paginator } from "@app/core/datasources/models/pageable-data-source";
import { ExcelExportService } from "@app/core/excel/services/excel-export.service";
import { SheetExportService } from "@app/core/excel/services/sheet-export.service";
import { Item } from "@app/core/item/models/item";
import { ItemService } from "@app/core/item/services/item.service";
import { ProgressNotification } from "@app/core/notifications/models/notification";
import { STAGE } from "@app/core/notifications/models/progress";
import { NotificationService } from "@app/core/notifications/services/notification.service";
import { BehaviorSubject } from "rxjs";

interface LogItem {
  timestamp: Date;
  message: string;
}

@Component({
  selector: "app-demo-export",
  templateUrl: "./demo-export.component.html",
  styleUrls: ["./demo-export.component.scss"],
  imports: [
    MatDivider,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatHint,
    MatSelect,
    MatOption,
    MatButton,
    MatBadge,
    MatIcon,
    MatProgressBar,
    AsyncPipe,
  ],
})
export class DemoExportComponent {
  readonly exportService = inject(ExcelExportService);
  readonly sheetService = inject(SheetExportService);
  readonly dataService = inject(ItemService);
  private readonly notifyService = inject(NotificationService);

  exportEvents: LogItem[] = [];
  exportEvents$ = new BehaviorSubject<LogItem[]>(this.exportEvents);
  progressMode: ProgressBarMode = "determinate";
  progressColor = "primary";
  progressValue = 0;
  private _notif?: ProgressNotification;
  cols = new FormControl(5, [Validators.required]);
  rows = new FormControl(37, [Validators.required]);
  pageSize = new FormControl(10, [Validators.required]);
  library = new FormControl("exceljs", [Validators.required]);

  resetProgress(): void {
    this.progressMode = "determinate";
    this.progressColor = "primary";
    this.progressValue = 0;
    this.exportEvents = [];
    this.exportEvents$.next(this.exportEvents);
  }

  export(): void {
    this.resetProgress();

    this._notif = this.notifyService.notify(
      new ProgressNotification({
        severity: "info",
        message: `Export demo`,
        show: false,
        persistent: true,
      })
    ) as ProgressNotification;
    const p = new Paginator(this.pageSize.value!);
    this.dataService.itemCount = this.rows.value!;
    this.dataService.attributeCount = this.cols.value!;
    const dataSource = new PageableDataSource<Item, Paginator>(this.dataService);
    dataSource.paginator = p;
    dataSource.length$.subscribe((l) => {
      console.log(`[demo-export] datasource length is ${l}`);
      p.length = l;
    });
    dataSource.error$.subscribe((e) => {
      this._notif!.severity = "severe";
      console.error(`[demo-export] datasource error: ${e}`);
    });
    const service = this.library.value === "xslx" ? this.sheetService : this.exportService;

    service.export(dataSource, this.dataService.itemHeaders).subscribe((e) => {
      switch (e.stage) {
        case STAGE.PENDING:
        case STAGE.PAUSE:
          this.progressMode = "indeterminate";
          break;
        case STAGE.SUCCESS:
          this.progressColor = "primary";
          break;
        case STAGE.ERROR:
          this._notif!.severity = "severe";
          break;
        case STAGE.PARTIAL:
          this.progressColor = "warn";
          this._notif!.severity = "warn";
          break;
        case STAGE.PROGRESS:
          this.progressColor = "accent";
          break;
      }
      this._notif!.setProgress(e.position.value, e.position.total, e.stage);
      this.progressValue = Math.ceil((e.position.value / e.position.total) * 100);
      this.exportEvents.push({
        timestamp: new Date(),
        message: `progress  ${this.progressValue}% (${JSON.stringify(e)})`,
      });
      this.exportEvents$.next(this.exportEvents);
    });
  }
}
