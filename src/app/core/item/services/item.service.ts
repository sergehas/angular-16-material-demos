import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { HttpService, Page } from '../../services/http-service';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends HttpService<Item> {

  itemCount = 37;
  _attributeCount = 5;

  private attributeHeaders: string[];

  constructor(http: HttpClient) {
    super(http, "fake");
    this.attributeHeaders = this.generateHeaders();
  }

  private generateHeaders(): string[] {
    return Array.from(Array(this._attributeCount).keys()).map(i => `attr${i}`);
  }

  private generateItem(v: number): Item {
    let it = {} as Item;
    this.attributeHeaders.forEach(h => {
      it[h] = `val ${h} #${v}`
    })
    return it;

  }

  set attributeCount(c: number) {
    this._attributeCount = c;
    this.attributeHeaders = this.generateHeaders();
  }

  get itemHeaders(): string[] {
    return [...this.attributeHeaders];
  }

  override count(filter?: Partial<Item>): Observable<number> {
    return of(this.itemCount);
  }

  override find(
    filter: Partial<Item>,
    sort: Sort | undefined,
    page: Page | undefined
  ): Observable<Item[]> {
    let start = page ? page.pageNumber * page.pageSize : 0;
    let end = page ? (page.pageNumber + 1) * page.pageSize : this.itemCount;
    end = Math.min(end, this.itemCount);
    console.info(`generating fake items from ${start} to ${end}`);
    let data: Item[] = [];
    for (let i = start; i < end; i++) {
      data.push(this.generateItem(i));
    }
    return of(data);
  }

}
