import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { ReactiveFormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTreeModule } from "@angular/material/tree";

import { SharedModule } from "./shared/shared.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ArtInstituteModule } from "./art-institute/art-institute.module";
import { ExcelExportService } from "./core/services/excel-export.service";
import { NotificationService } from "./core/services/notification.service";
import { ServicesModule } from "./core/services/services.module";
import { StorageService } from "./core/services/storage.service";
import { DemoModule } from "./demo/demo.module";

import { IconsModule } from "./core/icons/icons.module";

import { NotificationCenterComponent } from "./shared/components/notification-center/notification-center.component";

import { DatePipe } from "@angular/common";
import { ListOfValuesModule } from "./list-of-values/list-of-values.module";
import { NavModule } from "./nav/nav.module";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		// import HttpClientModule after BrowserModule.
		HttpClientModule,
		TranslateModule.forRoot({
			defaultLanguage: "en-US",
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),

		MatButtonModule,
		MatSnackBarModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatSidenavModule,
		MatListModule,
		MatTreeModule,
		MatButtonModule,
		MatIconModule,
		MatBadgeModule,
		MatInputModule,
		MatSelectModule,
		MatRadioModule,
		MatCardModule,
		ReactiveFormsModule,

		SharedModule,
		ServicesModule,
		IconsModule,
		AppRoutingModule,
		DemoModule,
		NavModule,
		ArtInstituteModule,
		NotificationCenterComponent,
		ListOfValuesModule,
	],
	providers: [StorageService, NotificationService, ExcelExportService, DatePipe],
	bootstrap: [AppComponent],
})
export class AppModule { }
