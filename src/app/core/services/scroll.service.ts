import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ScrollService {
  private readonly scrollSubject = new Subject<void>();
  readonly scrolling$ = this.scrollSubject.asObservable();
  constructor() {}

  scroll() {
    //console.debug("scroll detected");
    this.scrollSubject.next();
  }
}
