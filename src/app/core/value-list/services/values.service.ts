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

	override count(criteria?: ValueCrtieria): Observable<number> {
		let params = new HttpParams();
		params = params.set("filter", this.encodeFilter(criteria));
		return this.http
			.get<{ items: Value[] }>(this.baseUrl, {
				headers: this.headers,
				params: params,
			})
			.pipe(
				// filtering &countin apply client side... must of couse be done by "real" API, not by GUI
				switchMap((res) => res?.items),
				count((value) => {
					return criteria?.name
						? value.name.startsWith(criteria.name)
						: true && criteria?.group
						? value.group.startsWith(criteria.group)
						: true;
				})
			);
	}
}
