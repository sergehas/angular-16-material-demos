import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { HttpLoaderFactory } from "./app/app.module";
import { StorageService } from "./app/core/services/storage.service";
import { NotificationService } from "./app/core/services/notification.service";
import { ExcelExportService } from "./app/core/services/excel-export.service";
import { DatePipe } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from "@angular/common/http";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { ServicesModule } from "./app/core/services/services.module";
import { IconsModule } from "./app/core/icons/icons.module";
import { AppRoutingModule } from "./app/app-routing.module";
import { DemoModule } from "./app/demo/demo.module";
import { NavModule } from "./app/nav/nav.module";
import { ArtInstituteModule } from "./app/art-institute/art-institute.module";
import { ListOfValuesModule } from "./app/list-of-values/list-of-values.module";
import { AppComponent } from "./app/app.component";
import { importProvidersFrom } from "@angular/core";

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, TranslateModule.forRoot({
            defaultLanguage: "en-US",
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }), MatToolbarModule, MatSidenavModule, MatIconModule, MatBadgeModule, MatButtonModule, ServicesModule, IconsModule, AppRoutingModule, DemoModule, NavModule, ArtInstituteModule, ListOfValuesModule),
        StorageService,
        NotificationService,
        ExcelExportService,
        DatePipe,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
    ]
})
  .catch((err) => console.error(err));
