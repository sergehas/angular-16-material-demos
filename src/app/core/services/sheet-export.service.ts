import { Injectable } from "@angular/core";

import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";
import { Progress, STAGE } from "src/app/core/models/progress";
import { utils, writeFile } from "xlsx";
import { PageableDataSource, Paginator } from "../models/pageable-data-source";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class SheetExportService {
  constructor(protected notifService: NotificationService) {}

  export<T, P extends MatPaginator | Paginator = MatPaginator>(
    source: PageableDataSource<T, P>,
    _headers: string[]
  ): Observable<Progress> {
    const status = new Progress();
    const statusSubject = new BehaviorSubject<Progress>(status);
    console.log(`[sheet-export] starting export`);

    /**
     *  centralize the workbook finalization
     * @param workbook
     * @param stage
     * @returns
     */
    const finalizeWorkbook = async (
      rows: T[],
      stage = STAGE.SUCCESS
    ): Promise<void> => {
      console.info(`[sheet-export] building worksheet...`);
      const ws = utils.json_to_sheet(rows);
      console.info(`[sheet-export] building worksheet...`);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "report");

      console.info(`[sheet-export] writing file....`);
      writeFile(wb, "sheet-service.xlsx", { compression: false });
      console.info(`[sheet-export] export done`);
      status.stage = stage;
      statusSubject.next(status);
      source.disconnect();
      statusSubject.complete();
      return Promise.resolve();
    };

    /**
     * manage (export) pages
     */
    status.position.total = source.length;
    source.count();
    source.loadPage();
    const fullData: T[] = [];
    /**
     * use the pager observable to get the datasource size
     */
    source.length$.subscribe((len) => {
      console.info(`[sheet-export] row count to export: ${len}`);
      status.position.total = len;
      statusSubject.next(status);
    });

    source.error$.subscribe((e) => {
      status.stage = STAGE.ERROR;
      console.error(`[sheet-export] error: ${e}`);
      statusSubject.next(status);
    });

    source.connect().subscribe((data) => {
      //whenever data are available, add them to export
      console.info(
        `[sheet-export] exporting page: ${source.paginator?.pageIndex} from ${source.paginator?.getNumberOfPages()}`
      );
      if (source.paginator !== undefined) {
        status.position.value += data.length;
        status.stage = STAGE.PROGRESS;
        statusSubject.next(status);
      }
      console.info(`[sheet-export] new rows to export: ${data.length}`);
      fullData.push(...data);

      if (source.paginator?.hasNextPage()) {
        console.info(`[sheet-export] export next page`);
        source.paginator.nextPage();
      } else {
        console.info(
          `[sheet-export] no more page. Last page was ${source.paginator?.pageIndex}`
        );
        finalizeWorkbook(fullData);
      }
    });

    return statusSubject.asObservable();
  }
}
