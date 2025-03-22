import { VERSION as CDK_VERSION } from "@angular/cdk";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Type,
  ViewChild,
  inject,
} from "@angular/core";
import { VERSION as MAT_VERSION } from "@angular/material/core";
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from "@angular/material/sidenav";
import { RouterOutlet, RouterLink } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, map, shareReplay } from "rxjs";

import { Notification } from "./core/models/notification";
import { NotificationService } from "./core/services/notification.service";
import { ScrollService } from "./core/services/scroll.service";
import { slideAnimations } from "./shared/animations/route-animation";
import { MatToolbar } from "@angular/material/toolbar";
import { AsyncPipe } from "@angular/common";
import { MatIconButton, MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatBadge } from "@angular/material/badge";
import { TreeNavComponent } from "./shared/components/tree-nav/tree-nav.component";
import { NotificationCenterComponent } from "./shared/components/notification-center/notification-center.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [slideAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatButton,
    RouterLink,
    MatBadge,
    MatSidenavContainer,
    MatSidenav,
    TreeNavComponent,
    MatSidenavContent,
    RouterOutlet,
    NotificationCenterComponent,
    AsyncPipe,
  ],
})
export class AppComponent implements AfterViewInit {
  private service = inject(NotificationService);
  private scrollService = inject(ScrollService);

  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

  title = `Angular ${CDK_VERSION.full} Material ${MAT_VERSION.full} demo`;
  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );
  notifications$: Observable<Set<Notification>>;
  animation: string = "";
  constructor() {
    const translate = inject(TranslateService);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang("en-US");

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use("en-US");

    this.notifications$ = this.service.notifications$;
  }

  ngAfterViewInit(): void {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(() => this.scrollService.scroll());
  }
  prepareRoute(outlet: RouterOutlet) {
    console.info(
      `[app-root] prepareRoute ${outlet?.activatedRouteData && outlet.activatedRouteData["animation"]}`
    );
    //return this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"];
    return outlet?.activatedRouteData && outlet.activatedRouteData["animation"];
  }

  onActivate(_component: Type<unknown>) {
    const ar = this.outlet.activatedRoute;
    this.animation = this.outlet.activatedRouteData && this.outlet.activatedRouteData["animation"];
    console.info(
      `[app-root] activate animation ${ar?.snapshot.data["animation"]} on route ${ar?.snapshot.url}}`
    );
  }
}
