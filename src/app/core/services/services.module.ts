import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StorageService } from "./storage.service";
import { NotificationService } from "./notification.service";
import { ExcelExportService } from "./excel-export.service";

@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [StorageService, NotificationService, ExcelExportService],
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
