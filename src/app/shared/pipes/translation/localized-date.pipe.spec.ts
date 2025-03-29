import { DatePipe } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TranslateService } from "@ngx-translate/core";
import { LocalizedDatePipe } from "./localized-date.pipe";

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      LocalizedDatePipe,
      DatePipe,
      {
        provide: TranslateService,
        useValue: {
          get: (x: string) => {
            return x;
          },
        },
      },
      {
        provide: ChangeDetectorRef,
        useValue: {
          detectChanges: () => {
            /** noop */
          },
        },
      },
    ],
  });
});

describe("LocalizedDatePipe", () => {
  it("create an instance", () => {
    const pipe = TestBed.inject(LocalizedDatePipe);
    expect(pipe).toBeTruthy();
  });
});
