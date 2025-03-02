import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

import { SharedModule } from "./shared/shared.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ArtInstituteModule } from "./art-institute/art-institute.module";
import { IconsModule } from "./core/icons/icons.module";
import { ExcelExportService } from "./core/services/excel-export.service";
import { NotificationService } from "./core/services/notification.service";
import { ServicesModule } from "./core/services/services.module";
import { StorageService } from "./core/services/storage.service";
import { DemoModule } from "./demo/demo.module";

import { NotificationCenterComponent } from "./shared/components/notification-center/notification-center.component";

import { DatePipe } from "@angular/common";

import { ListOfValuesModule } from "./list-of-values/list-of-values.module";
import { NavModule } from "./nav/nav.module";
import { TreeNavComponent } from "./shared/components/tree-nav/tree-nav.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: "en-US",
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    SharedModule,
    ServicesModule,
    IconsModule,
    AppRoutingModule,
    DemoModule,
    NavModule,
    ArtInstituteModule,
    ListOfValuesModule,
    NotificationCenterComponent,
    TreeNavComponent,
  ],
  providers: [
    StorageService,
    NotificationService,
    ExcelExportService,
    DatePipe,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
