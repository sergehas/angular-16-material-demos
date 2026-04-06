import { inject, Signal } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
  isActive,
  IsActiveMatchOptions,
  Router,
  ViewTransitionInfo,
} from "@angular/router";
import { RouteData } from "@app/core/commons/services/models/route-data";

export function onViewTransitionCreated({ from, to, transition }: ViewTransitionInfo) {
  const toConf = getRouteConfig(to);
  const fromConf = getRouteConfig(from);
  const animation = toConf.data.animation;
  console.info(
    `[onViewTransitionCreated] activate animation [${animation}] \
    from route [${fromConf.url}] to [${toConf.url}], change route [${isTargetRouteCurrent()()}]`
  );

  //no animation for error page or if the target route is the same as the current one
  if (
    animation === undefined ||
    createUrlTreeFromSnapshot(to, []).toString().indexOf("error") !== -1 ||
    isTargetRouteCurrent()()
  ) {
    return;
  }

  const fromTab = fromConf.data.tabIndex;
  const toTab = toConf.data.tabIndex;

  console.log(`[onViewTransitionCreated] animation from tab [${fromTab}] to tab [${toTab}]`);
  if (fromTab === undefined || toTab === undefined) {
    return;
  }
  if (!transition.types) {
    transition.skipTransition();
    return;
  }

  if (fromTab > toTab) {
    (transition.types as Set<string>).add(`${animation}-reverse`);
  }
  if (fromTab < toTab) {
    (transition.types as Set<string>).add(animation);
  }
}

function getRouteConfig(snapshot: ActivatedRouteSnapshot): { url: string; data: RouteData } {
  let data: RouteData = {};
  const stack: ActivatedRouteSnapshot[] = [snapshot.root];
  while (stack.length > 0) {
    const route = stack.pop()!;
    data = route.data as RouteData;
    stack.push(...route.children);
  }
  return { url: createUrlTreeFromSnapshot(snapshot, []).toString(), data: data };
}

function isTargetRouteCurrent(): Signal<boolean> {
  const router = inject(Router);
  const targetUrl = router.currentNavigation()!.finalUrl!;
  // Skip transition if only fragment or query params change
  const config: Partial<IsActiveMatchOptions> = {
    paths: "exact",
    matrixParams: "exact",
    fragment: "exact",
    queryParams: "ignored",
  };
  return isActive(targetUrl, router, config);
}
