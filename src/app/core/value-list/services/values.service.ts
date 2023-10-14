import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, count, filter, switchMap, toArray, map, tap } from "rxjs";

import { HttpService, Page } from "../../services/http-service";
import { Value } from "../models/value";

@Injectable({
	providedIn: "root",
})
export class ValuesService extends HttpService<Value> {
	static HREF = "assets/mockup/values.json";

	constructor(http: HttpClient) {
		super(http, ValuesService.HREF);
	}

	override count(criteria = ""): Observable<number> {
		return this.http
			.get<{ items: Value[] }>(this.baseUrl, {
				headers: this.headers,
				params: new HttpParams().set("filter", criteria),
			})
			.pipe(
				// filtering &countin apply client side... must of couse be done by "real" API, not by GUI
				switchMap((res) => res?.items),
				count((value) => value.name.startsWith(criteria))
			);
	}
}
