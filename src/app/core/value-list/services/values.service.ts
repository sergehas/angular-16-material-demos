import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, count, filter, switchMap, toArray, map, tap } from "rxjs";

import { HttpService, Page } from "../../services/http-service";
import { Value } from "../models/value";

export type ValueCrtieria = { name?: string; group?: string };

@Injectable({
	providedIn: "root",
})
export class ValuesService extends HttpService<Value> {
	static HREF = "assets/mockup/values.json";

	constructor(http: HttpClient) {
		super(http, ValuesService.HREF);
	}

	private _filter(values: Value[], criteria?: ValueCrtieria): Value[] {
		console.debug("filtering :",values)
		if (!criteria) {
			return values;
		}
		return values.filter(
			(v) =>
				(criteria?.group ? v.group === criteria.group : true) &&
				(criteria?.name ? v.name.startsWith(criteria.name) : true)
		);
	}

	private _page(values: Value[], page?: Page): Value[] {
		if (!page) {
			return values;
		}
		const start = page.pageNumber * page.pageSize;
		return values.slice(
			start,
			start + page.pageSize
		);
	}

	override count(criteria?: ValueCrtieria): Observable<number> {
		let params = new HttpParams();
		params = params.set("q", this.encodeFilter(criteria));
		return this.http
			.get<{ items: Value[] }>(this.baseUrl, {
				headers: this.headers,
				params: params,
			})
			.pipe(
				// filtering &countin apply client side... must of couse be done by "real" API, not by GUI
				map((res) => res?.items),
				map((values) => this._filter(values, criteria).length),
				);
	}

	override find(
		criteria: ValueCrtieria | undefined,
		sort: Sort | undefined,
		page: Page | undefined
	): Observable<Value[]> {
		console.debug("call find with criteria: ", criteria, " sort: ", sort, " pager: ", page);
		return super.find(criteria, sort, page).pipe(
			// filtering/sorting apply client side... must of couse be done by "real" API, not by GUI
			map((values) => this._filter(values, criteria)),
			tap((values) => console.log("filtered: ", values)),
			map((values) =>
				values.sort((a, b) => a.name.localeCompare(b.name))
			),
			map((values) => this._page(values, page))
		);
	}
}
