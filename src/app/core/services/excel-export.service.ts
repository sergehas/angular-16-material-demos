import { Injectable } from "@angular/core";
import Excel, { Workbook } from "exceljs";

import { MatPaginator } from "@angular/material/paginator";
import { saveAs } from "file-saver";
import { BehaviorSubject, Observable, map } from "rxjs";
import { Progress, STAGE } from "src/app/core/models/progress";
import { PageableDataSource, Paginator } from "../models/pageable-data-source";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class ExcelExportService {
  constructor(protected notifService: NotificationService) { }

  export<T, P extends MatPaginator | Paginator = MatPaginator>(
    source: PageableDataSource<T, P>,
    headers: string[]
  ): Observable<Progress> {
    const status = new Progress();
    const statusSubject = new BehaviorSubject<Progress>(status);
    console.log(`[excel-export] starting export`);

    /**
     *  centralize the workbook finalization
     * @param workbook
     * @param stage
     * @returns
     */
    const finalizeWorkbook = async (
      workbook: Workbook,
      stage = STAGE.SUCCESS
    ): Promise<void> => {
      console.info(`[excel-export] writing file....`);
      await workbook.xlsx
        .writeBuffer()
        .then((data) => {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "export-service.xlsx");
        })
        .catch((e) => {
          stage = STAGE.ERROR;
          console.error("[excel-export] failure:", e)
        })
        .finally(() => {
          console.info(`[excel-export] export done`);
          status.stage = stage;
          statusSubject.next(status);
          source.disconnect();
          statusSubject.complete();
          return Promise.resolve();
        });
    };

    /**
     * manage (export) pages
     */
    //const workbook = new Excel.stream.xlsx.WorkbookWriter({ filename: "export-service" });
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("export");
    worksheet.columns = headers.map((h) => {
      return { header: h, key: h };
    });
    source.loadPage();
    status.position.total = source.length;
    source.connect().subscribe((data) => {
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
      // if (data.length <= 0) {
      //   // errors
      //   console.warn("fetching data failed");
      //   await finalizeWorkbook(workbook, STAGE.PARTIAL);
      //   return;
      // }
      data.forEach((r) => {
        worksheet.addRow(r);
      });
      if (source.paginator?.hasNextPage()) {
        console.info(`[excel-export] export next page`);
        source.paginator.nextPage();
      } else {
        // worksheet.commit();
        // await workbook.commit();
        console.info(
          `no more page. Last page was ${source.paginator?.pageIndex}`
        );
        finalizeWorkbook(workbook);
      }
    });

    /**
     * use the pager observable to get the datasource size
     */
    source.length$.pipe(
      map((len) => {
        //when the counting is done, then update notification
        console.info(`[excel-export] row count to export: ${len}`);
        status.position.total = len;
        statusSubject.next(status);
      })
    );
    source.count();

    return statusSubject.asObservable();
  }
}
