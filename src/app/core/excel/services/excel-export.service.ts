import { Injectable, inject } from "@angular/core";
import Excel, { Workbook } from "exceljs";

import { MatPaginator } from "@angular/material/paginator";
import { PageableDataSource, Paginator } from "@app/core/datasources/models/pageable-data-source";
import { Progress, STAGE } from "@app/core/notifications/models/progress";
import { NotificationService } from "@app/core/notifications/services/notification.service";
import { saveAs } from "file-saver";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
/**
 * Service for exporting data from a PageableDataSource to an Excel file.
 * Handles pagination, progress tracking, and error handling during export.
 */
export class ExcelExportService {
  protected notifyService = inject(NotificationService);

  /**
   * Exports data from a pageable data source to an Excel file.
   * The export process handles multiple pages, tracks progress, and saves the file automatically.
   *
   * @param source The pageable data source to export from
   * @param headers Array of column headers for the Excel worksheet
   * @returns Observable that emits progress updates during the export
   */
  export<T, P extends MatPaginator | Paginator = MatPaginator>(
    source: PageableDataSource<T, P>,
    headers: string[]
  ): Observable<Progress> {
    const status = new Progress();
    const statusSubject = new BehaviorSubject<Progress>(status);
    const subscriptions = new Subscription();
    console.log(`[excel-export] starting export`);

    /**
     *  centralize the workbook finalization
     * @param workbook
     * @param stage
     * @returns
     */
    const finalizeWorkbook = async (workbook: Workbook, stage = STAGE.SUCCESS): Promise<void> => {
      console.info(`[excel-export] writing file....`);
      let localStage = stage;
      await workbook.xlsx
        .writeBuffer()
        .then((data) => {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "export-service.xlsx");
        })
        .catch((e) => {
          localStage = STAGE.ERROR;
          console.error("[excel-export] failure:", e);
        })
        .finally(() => {
          console.info(`[excel-export] export done`);
          status.stage = localStage;
          statusSubject.next(status);
          source.disconnect();
          subscriptions.unsubscribe();
          statusSubject.complete();
          return Promise.resolve();
        });
    };

    /**
     * manage (export) pages
     */
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("export");
    worksheet.columns = headers.map((h) => {
      return { header: h, key: h };
    });
    status.position.total = source.length;
    source.count();
    source.loadPage();
    /**
     * use the pager observable to get the datasource size
     */
    subscriptions.add(
      source.length$.subscribe((len) => {
        console.info(`[excel-export] row count to export: ${len}`);
        status.position.total = len;
        statusSubject.next(status);
      })
    );

    subscriptions.add(
      source.error$.subscribe((e) => {
        status.stage = STAGE.ERROR;
        console.error(`[excel-export] error: ${e}`);
        dataSub?.unsubscribe();
        subscriptions.unsubscribe();
        statusSubject.next(status);
        statusSubject.complete();
      })
    );

    const dataSub = source.connect().subscribe((data) => {
      //whenever data are available, add them to export
      console.info(
        `[excel-export] exporting page: ${source.paginator?.pageIndex} from ${source.paginator?.getNumberOfPages()}`
      );
      if (source.paginator !== undefined) {
        status.position.value += data.length;
        status.stage = STAGE.PROGRESS;
        statusSubject.next(status);
      }
      console.info(`[excel-export] new rows to export: ${data.length}`);

      data.forEach((r) => {
        worksheet.addRow(r);
      });
      if (source.paginator?.hasNextPage()) {
        console.info(`[excel-export] export next page`);
        source.paginator.nextPage();
      } else {
        console.info(`no more page. Last page was ${source.paginator?.pageIndex}`);
        finalizeWorkbook(workbook);
      }
    });
    subscriptions.add(dataSub);

    return statusSubject.asObservable();
  }
}
