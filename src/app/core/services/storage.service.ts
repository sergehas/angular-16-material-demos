import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface Cache<T> extends Map<string, BehaviorSubject<T>> {

}

/**
 * Service for managing storage with caching capabilities.
 */
@Injectable({
  providedIn: "root",
})
export class StorageService {
  private readonly _cache: Cache<unknown>;
  private readonly _storage: Storage;

  /**
   * Initializes the storage service with localStorage and an empty cache.
   * The purpose of the "cache" is to avoid creating multiple BehaviorSubjects for the same key.
   * @param storage The userlying storage to use for storing items.
   */
  constructor(storage: Storage = localStorage) {
    this._storage = storage; //could be SessionStorage or LocalStorage
    this._cache = new Map<string, BehaviorSubject<unknown>>();
  }

  /**
   * Sets an item in storage and updates the cache.
   * @param key The key under which the value is stored.
   * @param value The value to store.
   * @returns A BehaviorSubject that emits the stored value.
   */
  setItem<T>(key: string, value: T): BehaviorSubject<T> {
    this._storage.setItem(key, JSON.stringify(value));
    const existing = this._cache.get(key);
    if (existing) {
      existing.next(value);
      return existing as BehaviorSubject<T>;
    }
    this._cache.set(key, new BehaviorSubject<unknown>(value));
    return this._cache.get(key)! as BehaviorSubject<T>;
  }

  /**
   * Retrieves an item from storage and updates the cache.
   * @param key The key of the item to retrieve.
   * @returns A BehaviorSubject that emits the stored value, or undefined if the item does not exist.
   */
  getItem<T>(key: string): BehaviorSubject<T> | undefined {
    const existing = this._cache.get(key);
    if (existing) {
      return existing as BehaviorSubject<T>;
    }
    const i = this._storage.getItem(key);
    if (i) {
      return this.setItem(key, JSON.parse(i));
    }
    return undefined;
  }

  /**
   * Removes an item from storage and updates the cache.
   * @param key The key of the item to remove.
   */
  removeItem(key: string) {
    this._storage.removeItem(key);
    if (this._cache.get(key)) this._cache.get(key)?.next(undefined);
  }
}
