import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

type serializable = object | unknown;
interface Cache<T extends serializable> extends Map<string, BehaviorSubject<T>> {

}

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _cache: Cache<serializable>;
  private _storage: Storage;

  constructor() {
    this._storage = localStorage; //could be SessionStorage or LocalStorage
    this._cache = new Map<string, BehaviorSubject<serializable>>();
  }

  setItem<T extends serializable>(key: string, value: T): BehaviorSubject<T> {
    this._storage.setItem(key, JSON.stringify(value));
    const existing = this._cache.get(key);
    if (existing) {
      existing.next(value);
      return existing as BehaviorSubject<T>;
    }
    this._cache.set(key, new BehaviorSubject<unknown>(value));
    return this._cache.get(key)! as BehaviorSubject<T>;
  }

  getItem<T extends serializable>(key: string): BehaviorSubject<T> | undefined {
    const existing = this._cache.get(key);
    if (existing) {
      return existing as BehaviorSubject<T>;
    }
    const i = this._storage.getItem(key);
    if (i) {
      return this.setItem(key, JSON.parse(i!));
    }
    return undefined;
  }

  removeItem(key: string) {
    this._storage.removeItem(key);
    if (this._cache.get(key)) this._cache.get(key)?.next(undefined);
  }
}
