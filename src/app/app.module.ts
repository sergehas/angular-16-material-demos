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

import { AppComponent } from "./app.component";
import { DemoModule } from "./demo/demo.module";
import { AppRoutingModule } from "./app-routing.module";

import { SharedModule } from "./shared/shared.module";

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

		SharedModule,
		AppRoutingModule,
		DemoModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
