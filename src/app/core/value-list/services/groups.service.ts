import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, count, filter, switchMap, toArray, map, tap } from "rxjs";

import { HttpService, Page } from "../../services/http-service";
import { Group } from "../models/group";

@Injectable({
	providedIn: "root",
})
export class GroupsService extends HttpService<Group> {
	static HREF = "assets/mockup/groups.json";

	constructor(http: HttpClient) {
		super(http, GroupsService.HREF);
	}

	override count(criteria = ""): Observable<number> {
		return this.http
			.get<{ items: Group[] }>(this.baseUrl, {
				headers: this.headers,
				params: new HttpParams().set("filter", criteria),
			})
			.pipe(
				// filtering &countin apply client side... must of couse be done by "real" API, not by GUI
				switchMap((res) => res?.items),
				count((group) => group.name.startsWith(criteria))
			);
	}

	override find(
		criteria = "",
		sort: Sort | undefined,
		page: Page | undefined
	): Observable<Group[]> {
		return super.find(criteria, sort, page).pipe(
			// filtering/sorting apply client side... must of couse be done by "real" API, not by GUI
			map((groups) =>
				groups.filter((group) => group.name.startsWith(criteria))
			),
			tap((groups) => groups.sort((a, b) => a.name.localeCompare(b.name)))
		);
	}
}
