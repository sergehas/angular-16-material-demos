import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

type serializable = object | Object;
interface ICache {
	[key: string]: BehaviorSubject<any>;
}

@Injectable({
	providedIn: "root",
})
export class StorageService {
	private cache: ICache;
	private storage: Storage;

	constructor() {
		this.storage = localStorage; //could be SessionStorage or LocalStorage
		this.cache = Object.create(null);
	}

	setItem<T extends serializable>(key: string, value: T): BehaviorSubject<T> {
		this.storage.setItem(key, JSON.stringify(value));

		if (this.cache[key]) {
			this.cache[key].next(value);
			return this.cache[key];
		}

		return (this.cache[key] = new BehaviorSubject(value));
	}

	getItem<T extends serializable>(
		key: string
	): BehaviorSubject<T | undefined> {
		if (this.cache[key]) {
			return this.cache[key];
		}
		const i = this.storage.getItem(key);
		if (i) {
			return (this.cache[key] = new BehaviorSubject<T | undefined>(
				JSON.parse(i!)
			));
		}
		return new BehaviorSubject<T | undefined>(undefined);
	}

	removeItem(key: string) {
		this.storage.removeItem(key);
		if (this.cache[key]) this.cache[key].next(undefined);
	}
}
