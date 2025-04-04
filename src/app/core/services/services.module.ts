import { CommonModule } from "@angular/common";
import { NgModule, inject } from "@angular/core";
import { ExcelExportService } from "./excel-export.service";
import { NotificationService } from "./notification.service";
import { ScrollService } from "./scroll.service";
import { SheetExportService } from "./sheet-export.service";
import { StorageService } from "./storage.service";

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
