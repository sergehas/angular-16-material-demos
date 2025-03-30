import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Observable, map, of, tap } from "rxjs";

import { Filter, HttpService, Page } from "../../services/http-service";
import { Value } from "../models/value";

export interface ValueCriteria extends Filter {
  name?: string;
  group?: string;
}

@Injectable({
  providedIn: "root",
})
export class ValuesService extends HttpService<Value> {
  static readonly HREF = "assets/mockup/values.json";
  private _updatedCache: Value[] = [];

  constructor() {
    const http = inject(HttpClient);

    super(http, ValuesService.HREF);
  }

  /**
   * Filters the values array based on criteria.
   * @param values Array of values to filter.
   * @param criteria Criteria to filter values.
   * @returns Filtered array of values.
   */
  private _filter(values: Value[], criteria?: ValueCriteria): Value[] {
    console.debug("filtering :", values);
    if (!criteria) {
      return values;
    }
    return values.filter(
      (v) =>
        (criteria?.group ? v.group === criteria.group : true) &&
        (criteria?.name ? v.name.startsWith(criteria.name) : true)
    );
  }

  /**
   * Paginates the values array.
   * @param values Array of values to paginate.
   * @param page Page information for pagination.
   * @returns Paginated array of values.
   */
  private _page(values: Value[], page?: Page): Value[] {
    if (!page) {
      return values;
    }
    const start = page.pageNumber * page.pageSize;
    return values.slice(start, start + page.pageSize);
  }

  /**
   * Merges the baseline values array with the patch values array.
   * @param baseline Baseline array of values.
   * @param patchValues Patch array of values.
   * @returns Merged array of values.
   */
  private _merge(baseline: Value[], patchValues: Value[]): Value[] {
    const r = [...baseline];
    const predicate = (b: Value, p: Value) => b.group === p.group && b.name === p.name;
    patchValues.forEach((p) => {
      const i = r.findIndex((b) => predicate(p, b));
      if (i > -1) {
        r[i] = p;
      } else {
        r.push(p);
      }
    });

    return r;
  }

  /**
   * Counts the number of values based on criteria.
   * @param criteria Criteria to filter values.
   * @returns Observable of the number of values.
   */
  override count(criteria?: ValueCriteria): Observable<number> {
    let params = new HttpParams();
    params = params.set("q", this.encodeFilter(criteria));
    return this.http
      .get<{ items: Value[] }>(this.baseUrl, {
        headers: this.headers,
        params: params,
      })
      .pipe(
        // filtering & counting apply client side... must of course be done by "real" API, not by GUI
        map((res) => this._merge(res?.items, this._updatedCache)),
        map((values) => this._filter(values, criteria).length)
      );
  }

  /**
   * Finds values based on criteria, sort, and pagination.
   * @param criteria Criteria to filter values.
   * @param sort Sort information.
   * @param page Page information for pagination.
   * @returns Observable of the array of values.
   */
  override find(
    criteria: ValueCriteria | undefined,
    sort: Sort | undefined,
    page: Page | undefined
  ): Observable<Value[]> {
    console.debug("call find with criteria: ", criteria, " sort: ", sort, " pager: ", page);
    return super.find(criteria, sort, page).pipe(
      map((values) => this._merge(values, this._updatedCache)),
      // filtering/sorting apply client side... must of course be done by "real" API, not by GUI
      map((values) => this._filter(values, criteria)),
      tap((values) => console.log("filtered: ", values)),
      map((values) => {
        return values.sort((a, b) => a.name.localeCompare(b.name));
      }),
      map((values) => this._page(values, page))
    );
  }

  /**
   * Saves a value and updates the cache.
   * @param v Value to save.
   * @returns Observable of the saved value.
   */
  save(v: Value): Observable<Value> {
    this._updatedCache = this._merge(this._updatedCache, [v]);
    console.info(`saved value: ${JSON.stringify(v)}, cache size: ${this._updatedCache.length}`);
    return of(v);
  }
}
