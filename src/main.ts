import { DatePipe } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withViewTransitions } from "@angular/router";
import { AppComponent } from "@app/app.component";
import { appRoutes } from "@app/app.routes";
import { ExcelExportService } from "@app/core/excel/services/excel-export.service";
import { IconsModule } from "@app/core/icons/icons.module";
import { NotificationService } from "@app/core/notifications/services/notification.service";
import { ServicesModule } from "@app/core/services/services.module";
import { StorageService } from "@app/core/storages/services/storage.service";
import { ArtInstituteRoutingModule } from "@app/features/art-institute/art-institute-routing.module";
import { DemoRoutingModule } from "@app/features/demo/demo-routing.module";
import { ListOfValuesRoutingModule } from "@app/features/list-of-values/list-of-values-routing.module";
import { NavRoutingModule } from "@app/features/nav/nav-routing.module";
import { onViewTransitionCreated } from "@app/shared/animations/route-animation";
import { TranslateModule } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";

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
    provideRouter(appRoutes, withViewTransitions({ onViewTransitionCreated })),
  ],
}).catch((err) => console.error(err));
