import { DatePipe } from "@angular/common";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";
import { HttpLoaderFactory } from "./app/app.module";
import { ArtInstituteModule } from "./app/art-institute/art-institute.module";
import { IconsModule } from "./app/core/icons/icons.module";
import { ExcelExportService } from "./app/core/services/excel-export.service";
import { NotificationService } from "./app/core/services/notification.service";
import { ServicesModule } from "./app/core/services/services.module";
import { StorageService } from "./app/core/services/storage.service";
import { DemoModule } from "./app/demo/demo.module";
import { ListOfValuesModule } from "./app/list-of-values/list-of-values.module";
import { NavModule } from "./app/nav/nav.module";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
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
      ServicesModule,
      IconsModule,
      AppRoutingModule,
      DemoModule,
      NavModule,
      ArtInstituteModule,
      ListOfValuesModule
    ),
    StorageService,
    NotificationService,
    ExcelExportService,
    DatePipe,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
