import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DomSanitizer } from "@angular/platform-browser";
import { provideTranslateService, TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import { Theme } from "@app/core/theme/theme.model";
import { ThemeService } from "@app/core/theme/theme.service";
import { ThemePickerComponent } from "./theme-picker.component";

const THEMES: Theme[] = [new Theme("first-theme", "First"), new Theme("second-theme", "Second")];

const themeSubjectMock = signal<Theme>(THEMES[0]);

class MockThemeService {
  selectedTheme = themeSubjectMock;

  getThemeList(): Theme[] {
    return THEMES;
  }

  setTheme(theme: Theme): void {
    themeSubjectMock.set(theme);
  }
}

class MockTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<TranslationObject> {
    return of({ TEST: "This is a test" });
  }
}

describe("ThemePickerComponent", () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let mockThemeService: MockThemeService;

  beforeEach(async () => {
    mockThemeService = new MockThemeService();

    TestBed.configureTestingModule({
      imports: [
        ThemePickerComponent,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
      ],
      providers: [
        {
          provide: ThemeService,
          useValue: mockThemeService,
        },
        provideTranslateService({}),
        { provide: TranslateLoader, useClass: MockTranslateLoader },
      ],
    });
    const _registry = TestBed.inject(MatIconRegistry);
    const _sanitizer = TestBed.inject(DomSanitizer);
    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should install theme based on Theme object", () => {
    spyOn(mockThemeService, "setTheme");
    const theme = THEMES[1];
    component.selectTheme(theme);
    expect(mockThemeService.setTheme).toHaveBeenCalledWith(theme);
  });

  it("should NOT install theme for a non-existing theme object", () => {
    spyOn(mockThemeService, "setTheme");
    component.selectTheme({ className: "does not exist", name: "Does Not Exist" } as Theme);
    expect(mockThemeService.setTheme).not.toHaveBeenCalled();
  });

  it("should track themes by key for performance", () => {
    const trackByResult = component.trackByThemeKey(0, THEMES[0]);
    expect(trackByResult).toBe(THEMES[0].className);
  });
});
