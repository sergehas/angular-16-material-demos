import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatTreeModule } from "@angular/material/tree";
import { MatBadgeModule } from "@angular/material/badge";

import { SharedModule } from "./shared/shared.module";

import { AppComponent } from "./app.component";
import { DemoModule } from "./demo/demo.module";
import { AppRoutingModule } from "./app-routing.module";
import { ArtInstituteModule } from "./art-institute/art-institute.module";
import { ServicesModule } from "./core/services/services.module";
import { StorageService } from "./core/services/storage.service";
import { NotificationService } from "./core/services/notification.service";
import { NotificationCenterComponent } from "./shared/components/notification-center/notification-center.component";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		// import HttpClientModule after BrowserModule.
		HttpClientModule,

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

		SharedModule,
		ServicesModule,
		AppRoutingModule,
		DemoModule,
		ArtInstituteModule,
		NotificationCenterComponent,
	],
	providers: [StorageService, NotificationService],
	bootstrap: [AppComponent],
})
export class AppModule {}
