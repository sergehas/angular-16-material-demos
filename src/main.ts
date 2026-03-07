import { DatePipe } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";
import { ArtInstituteRoutingModule } from "./app/art-institute/art-institute-routing.module";
import { IconsModule } from "./app/core/icons/icons.module";
import { ExcelExportService } from "./app/core/services/excel-export.service";
import { NotificationService } from "./app/core/services/notification.service";
import { ServicesModule } from "./app/core/services/services.module";
import { StorageService } from "./app/core/services/storage.service";
import { DemoRoutingModule } from "./app/demo/demo-routing.module";
import { ListOfValuesRoutingModule } from "./app/list-of-values/list-of-values-routing.module";
import { NavRoutingModule } from "./app/nav/nav-routing.module";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      TranslateModule.forRoot({
        fallbackLang: "en-US",
        loader: provideTranslateHttpLoader({ prefix: "/assets/i18n/", suffix: ".json" }),
      }),
      MatToolbarModule,
      MatSidenavModule,
      MatIconModule,
      MatBadgeModule,
      MatButtonModule,
      ServicesModule,
      IconsModule,
      AppRoutingModule,
      DemoRoutingModule,
      NavRoutingModule,
      ArtInstituteRoutingModule,
      ListOfValuesRoutingModule
    ),
    StorageService,
    NotificationService,
    ExcelExportService,
    DatePipe,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
