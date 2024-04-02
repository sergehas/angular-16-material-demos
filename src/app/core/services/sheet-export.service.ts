import { Injectable } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { utils, writeFile } from 'xlsx';
import { PageableDataSource, Paginator } from '../models/pageable-data-source';
import { STAGE, Status } from './excel-export.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SheetExportService {

  constructor(protected notifService: NotificationService) { }

  export<T, P extends MatPaginator | Paginator = MatPaginator>(source: PageableDataSource<T, P>, headers: string[]): Observable<Status> {
    const status = new Status();
    let statusSubject = new BehaviorSubject<Status>(status);
    console.log(`starting export`);

    /**
     *  centralize the workbook finalization
     * @param workbook 
     * @param stage 
     * @returns 
     */
    const finalizeWorkbook = async (rows: T[], stage = STAGE.SUCCESS): Promise<void> => {
      console.info(`building worksheet...`);
      const ws = utils.json_to_sheet(rows);
      console.info(`building worksheet...`);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "report");

      console.info(`writing file....`);
      writeFile(wb, "sheet-service.xlsx", { compression: false });
      console.info(`export done`);
      status.stage = stage;
      statusSubject.next(status);
      source.disconnect();
      statusSubject.complete();
      return Promise.resolve();
    }


    /**
     * manage (export) pages
     */
    source.loadPage();
    status.progress.total = source.length;
    const fullData: T[] = [];
    source.connect().subscribe((data) => {
      //whenever data are available, add them to export 
      console.info(`exporting page: ${source.paginator?.pageIndex} from ${source.paginator?.getNumberOfPages()}`);
      if (source.paginator !== undefined) {
        status.progress.value += data.length;
        status.stage = STAGE.PROGRESS;
        statusSubject.next(status);
      }
      console.info(`new rows to export: ${data.length}`);
      // if (data.length <= 0) {
      //   // errors
      //   console.warn("fetching data failed");
      //   await finalizeWorkbook(workbook, STAGE.PARTIAL);
      //   return;
      // }
      fullData.push(...data);

      if (source.paginator?.hasNextPage()) {
        console.info(`export next page`);
        source.paginator.nextPage();
      } else {
        // worksheet.commit();
        // await workbook.commit();
        console.info(`no more page. Last page was ${source.paginator?.pageIndex}`);
        finalizeWorkbook(fullData);
      }

    })

    /** 
     * use the pager observable to get the datasource size
     */
    source.length$.pipe(map((len) => {
      //when the counting is done, then update notification
      console.info(`row count to export: ${len}`);
      status.progress.total = len;
      statusSubject.next(status);
    }))
    source.count();

    return statusSubject.asObservable();
  }

}
