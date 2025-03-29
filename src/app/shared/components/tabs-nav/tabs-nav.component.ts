import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  Type,
  ViewChild,
  booleanAttribute,
  inject,
  input,
} from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";

import {
  ActivatedRoute,
  ChildrenOutletContexts,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from "@angular/router";
import { MenuNode, NavBuilder } from "./models/nav-builder";

import { MatIconModule } from "@angular/material/icon";
import { Notification } from "src/app/core/models/notification";
import { NotificationService } from "src/app/core/services/notification.service";
import { slideAnimations } from "../../animations/route-animation";

const TAB_INDEX_PROP = "tabIndex";
const TAB_SLIDE_ANIMATION = "tabSlide";

/*
 * to hide tabs depending on roles, remove the comment in the html template & uncomment below AnyRolesDirective
 */

@Component({
  selector: "app-tabs-nav",
  templateUrl: "./tabs-nav.component.html",
  styleUrls: ["./tabs-nav.component.scss"],
  imports: [RouterModule, MatTabsModule, MatIconModule, RouterLink, RouterOutlet],
  animations: [slideAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsNavComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contexts = inject(ChildrenOutletContexts);

  readonly path = input("");
  readonly defaultRoute = input<string>();
  readonly sticky = input(false, { transform: booleanAttribute });
  @Output() activate = new EventEmitter<ActivatedRoute | null>();
  @Output() deactivate = new EventEmitter<Type<unknown>>();
  @Output() indexFocused = new EventEmitter<number>();

  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

  navLinks: MenuNode[] = [];
  private readonly _notifyService = inject(NotificationService);
  animation: string | number = -1;

  ngOnInit(): void {
    console.info("[tab-nav] router config", this.router);
    const root = this.router.config.find((p) => p.path === this.path());
    if (!root?.children || root?.children.length <= 0) {
      this._notifyService.notify(
        new Notification({
          severity: "warn",
          message: `${this.path()} has no menu entry`,
          show: true,
          persistent: false,
        })
      );
      return;
    }

    /** */
    this.navLinks = root.children.map((c, index) => {
      //1st add an index for animation increment/decrement
      if (c.data === undefined) {
        c.data = {};
      }
      root.children![index].data![TAB_INDEX_PROP] = index;
      // then build nodes for UI component
      return NavBuilder.nodeFromPath(".", c.path, c.data["icon"], c.data["roles"]);
    });
  }
  ngAfterViewInit(): void {
    //if the current navigation is this path, then navigate to default child route
    const defaultRoute = this.defaultRoute();
    if (
      defaultRoute &&
      this.router.createUrlTree([this.path()]).toString() === this.router.routerState.snapshot.url
    ) {
      console.log(`[tab-nav] navigate to default ${defaultRoute} relative to ${this.route}`);
      this.router.navigate([defaultRoute], { relativeTo: this.route });
    }
  }

  /**
   *use "onActivate" instead of directy fetch animation from the trigger  -calling a function, eg "[@Trigger]="myAnim()]" - to reduce number of calls.
   *Warning: at this step, outlet may be not yet initialized
   * @param {Type<any>} component the activated component (not realy useful...)
   * @memberof TabsNavComponent
   */
  onActivate(_component: Type<unknown>) {
    const route = this.contexts.getContext("primary")!.route;
    this.activate.emit(route);
    const data = route?.snapshot?.data ?? {};
    this.animation =
      data["animation"] === TAB_SLIDE_ANIMATION ? data[TAB_INDEX_PROP] : data["animation"];
    console.info(`[tab-nav] activate animation ${this.animation} on route ${route?.snapshot.url}}`);
  }

  // prepareRoute(outlet: RouterOutlet) {
  // 	console.info(`[tab-nav] prepareRoute ${outlet?.activatedRouteData && outlet.activatedRouteData['animation']}`);
  // 	//return this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"];
  // 	return (
  // 		outlet?.activatedRouteData &&
  // 		outlet.activatedRouteData['animation']
  // 	);
  // }

  onDeactivate(component: Type<unknown>) {
    this.deactivate.emit(component);

    console.info(`[tab-nav] deactivate route. outlet is active:  ${this.outlet?.isActivated}`);
  }

  onFocus(index: number) {
    console.info(`[tab-nav] index focused ${index}`);
    this.indexFocused.emit(index);
  }
}
