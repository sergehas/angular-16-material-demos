import { AfterViewInit, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Item } from 'src/app/core/item/models/item';
import { ItemService } from 'src/app/core/item/services/item.service';
import { PageableDataSource, Paginator } from 'src/app/core/models/pageable-data-source';
import { ExcelExportService } from 'src/app/core/services/excel-export.service';


@Component({
  selector: 'app-demo-export',
  templateUrl: './demo-export.component.html',
  styleUrls: ['./demo-export.component.scss']
})
export class DemoExportComponent implements AfterViewInit {
  exportEvents: string[] = [];

  constructor(readonly exportService: ExcelExportService, readonly dataService: ItemService) {
    //console.debug(`initializing datasource`);
  }
  cols = new FormControl(5, [Validators.required]);
  rows = new FormControl(37, [Validators.required]);

  export(): void {
    let dataSource = new PageableDataSource<Item, Paginator>(this.dataService);
    const p = new Paginator(100);
    p.pageSize = 100;
    this.dataService.itemCount=this.rows.value!;
    this.dataService.attributeCount=this.cols.value!;
    dataSource.paginator = p;
    dataSource.length$.subscribe(l => {
      console.log(`set export datasource length to ${l}`);
    })

    //for demo, reset pager
    this.exportService.export(dataSource, this.dataService.itemHeaders).subscribe(e => {
      this.exportEvents.push(`[${new Date().toISOString()}]: progress ${JSON.stringify(e)}`)
    });
  }

  ngAfterViewInit() {
  }

}
