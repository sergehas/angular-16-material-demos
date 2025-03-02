import { DatePipe } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TranslateService } from "@ngx-translate/core";
import { LocalizedDatePipe } from "./localized-date.pipe";

let service: TranslateService;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: TranslateService,
        useValue: {
          get: (x: string) => {
            return x;
          },
        },
      },
      { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } },
    ],
  });
});

describe("LocalizedDatePipe", () => {
  it("create an instance", () => {
    const changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    const service = TestBed.inject(TranslateService);
    const pipe = new LocalizedDatePipe(service, new DatePipe("en"), changeDetectorRef);
    expect(pipe).toBeTruthy();
  });
});
