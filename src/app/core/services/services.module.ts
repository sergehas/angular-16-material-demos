import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { ExcelExportService } from "./excel-export.service";
import { NotificationService } from "./notification.service";
import { SheetExportService } from "./sheet-export.service";
import { StorageService } from "./storage.service";

@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [StorageService, NotificationService, ExcelExportService, SheetExportService],
})
export class ServicesModule {
	/** guarde to avoid multiple import */
	constructor(@Optional() @SkipSelf() core: ServicesModule) {
		if (core) {
			throw new Error(
				"You should import ServiceModule module only in the root module"
			);
		}
	}
}
