import { CommonModule } from "@angular/common";
import { NgModule, inject } from "@angular/core";
import { ScrollService } from "@app/core/commons/services/scroll.service";
import { ExcelExportService } from "@app/core/excel/services/excel-export.service";
import { SheetExportService } from "@app/core/excel/services/sheet-export.service";
import { NotificationService } from "@app/core/notifications/services/notification.service";
import { StorageService } from "@app/core/storages/services/storage.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ScrollService,
    StorageService,
    NotificationService,
    ExcelExportService,
    SheetExportService,
  ],
})
export class ServicesModule {
  /** guarde to avoid multiple import */
  constructor() {
    const core = inject(ServicesModule, { optional: true, skipSelf: true });

    if (core) {
      throw new Error("You should import ServiceModule module only in the root module");
    }
  }
}
