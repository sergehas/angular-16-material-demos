import { AfterViewInit, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'src/app/core/item/models/item';
import { ItemService } from 'src/app/core/item/services/item.service';
import { PageableDataSource, Paginator } from 'src/app/core/models/pageable-data-source';
import { ExcelExportService, STAGE } from 'src/app/core/services/excel-export.service';

type LogItem = {
  timestamp: Date, message: string
}

@Component({
  selector: 'app-demo-export',
  templateUrl: './demo-export.component.html',
  styleUrls: ['./demo-export.component.scss'],

})
export class DemoExportComponent implements AfterViewInit {

  exportEvents: LogItem[] = [];
  exportEvents$ = new BehaviorSubject<LogItem[]>(this.exportEvents);
  progressMode: ProgressBarMode = "determinate";
  progressColor = "primary";
  progressValue = 0;

  constructor(readonly exportService: ExcelExportService, readonly dataService: ItemService) {
    //console.debug(`initializing datasource`);
  }
  cols = new FormControl(5, [Validators.required]);
  rows = new FormControl(37, [Validators.required]);
  pageSize = new FormControl(10, [Validators.required]);

  resetProgress(): void {
    this.progressMode = "determinate";
    this.progressColor = "primary";
    this.progressValue = 0;
    this.exportEvents = [];
    this.exportEvents$.next(this.exportEvents);
  }

  export(): void {
    this.resetProgress();
    let dataSource = new PageableDataSource<Item, Paginator>(this.dataService);
    const p = new Paginator(this.pageSize.value!);
    this.dataService.itemCount = this.rows.value!;
    this.dataService.attributeCount = this.cols.value!;
    dataSource.paginator = p;
    dataSource.length$.subscribe(l => {
      console.log(`export datasource length is ${l}`);
      p.length = l;
    })

    this.exportService.export(dataSource, this.dataService.itemHeaders).subscribe(e => {
      switch (e.stage) {
        case STAGE.PENDING:
        case STAGE.PAUSE:
          this.progressMode = "indeterminate";
          break;
        case STAGE.SUCCESS:
          this.progressColor = "primary";
          break;
        case STAGE.ERROR:
        case STAGE.PARTIAL:
          this.progressColor = "warn";
          break;
        case STAGE.PROGRESS:
          this.progressColor = "accent";
          break;
      }
      this.progressValue = Math.ceil((e.progress.value / e.progress.total) * 100);
      this.exportEvents.push({ timestamp: new Date(), message: `progress  ${this.progressValue}% (${JSON.stringify(e)})` });
      this.exportEvents$.next(this.exportEvents);
    });
  }

  ngAfterViewInit() {
  }
}