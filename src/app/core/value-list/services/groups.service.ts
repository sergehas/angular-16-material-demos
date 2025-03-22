import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Observable, map } from "rxjs";

import { HttpService, Page } from "../../services/http-service";
import { Group } from "../models/group";

export type GroupCrtieria = { name?: string };

@Injectable({
  providedIn: "root",
})
export class GroupsService extends HttpService<Group> {
  static readonly HREF = "assets/mockup/groups.json";

  constructor() {
    const http = inject(HttpClient);

    super(http, GroupsService.HREF);
  }

  private _page(groups: Group[], page?: Page): Group[] {
    if (!page) {
      return groups;
    }
    const start = page.pageNumber * page.pageSize;
    return groups.slice(start, start + page.pageSize);
  }
  private _filter(groups: Group[], criteria?: GroupCrtieria): Group[] {
    if (!criteria) {
      return groups;
    }
    return groups.filter((g) => (criteria?.name ? g.name.startsWith(criteria.name) : true));
  }

  override count(criteria?: GroupCrtieria): Observable<number> {
    let params = new HttpParams();
    params = params.set("q", this.encodeFilter(criteria));

    return this.http
      .get<{ items: Group[] }>(this.baseUrl, {
        headers: this.headers,
        params: params,
      })
      .pipe(
        // filtering &countin apply client side... must of couse be done by "real" API, not by GUI
        map((res) => res?.items),
        map((groups) => this._filter(groups, criteria).length)
      );
  }

  override find(
    criteria: GroupCrtieria | undefined,
    sort: Sort | undefined,
    page: Page | undefined
  ): Observable<Group[]> {
    return super.find(criteria, sort, page).pipe(
      // filtering/sorting apply client side... must of couse be done by "real" API, not by GUI
      map((groups) => this._filter(groups, criteria)),
      map((groups) => {
        return groups.sort((a, b) => a.name.localeCompare(b.name));
      }),
      map((groups) => this._page(groups, page))
    );
  }
}
