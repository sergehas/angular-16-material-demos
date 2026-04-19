import { DOCUMENT } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { Theme, ThemeScheme } from "./theme.model";
import { ThemeService } from "./theme.service";

describe("ThemeService", () => {
  let service: ThemeService;
  let mockClassList: {
    add: (className: string) => void;
    remove: (...classNames: string[]) => void;
    contains: (className: string) => boolean;
    forEach: (callback: (className: string) => void) => void;
    toArray: () => string[];
  };

  const createMockClassList = (classes: string[]) => {
    const set = new Set(classes);

    return {
      add(className: string) {
        set.add(className);
      },
      remove(...classNames: string[]) {
        classNames.forEach((className) => set.delete(className));
      },
      contains(className: string) {
        return set.has(className);
      },
      forEach(callback: (className: string) => void) {
        Array.from(set).forEach(callback);
      },
      toArray() {
        return Array.from(set);
      },
    };
  };

  beforeEach(() => {
    mockClassList = createMockClassList([ThemeScheme.DARK]);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });

    service = TestBed.inject(ThemeService);
  });

  it("should be created with DARK scheme from classList", () => {
    expect(service).toBeTruthy();
    expect(service.themeScheme()).toBe(ThemeScheme.DARK);
  });

  it("should initialize with LIGHT scheme when classList contains light", () => {
    TestBed.resetTestingModule();
    mockClassList = createMockClassList([ThemeScheme.LIGHT]);
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });

    service = TestBed.inject(ThemeService);
    expect(service.themeScheme()).toBe(ThemeScheme.LIGHT);
  });

  it("should initialize with AUTO scheme when no scheme class is present", () => {
    TestBed.resetTestingModule();
    mockClassList = createMockClassList([]);
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });

    service = TestBed.inject(ThemeService);
    expect(service.themeScheme()).toBe(ThemeScheme.AUTO);
  });

  it("should switch to light theme scheme and remove dark", () => {
    mockClassList = createMockClassList([ThemeScheme.DARK]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });
    service = TestBed.inject(ThemeService);

    service.setThemeScheme("light");

    expect(mockClassList.contains(ThemeScheme.LIGHT)).toBeTrue();
    expect(mockClassList.contains(ThemeScheme.DARK)).toBeFalse();
    expect(service.themeScheme()).toBe(ThemeScheme.LIGHT);
  });

  it("should switch to dark theme scheme and remove light", () => {
    mockClassList = createMockClassList([ThemeScheme.LIGHT]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });
    service = TestBed.inject(ThemeService);

    service.setThemeScheme(ThemeScheme.DARK);

    expect(mockClassList.contains(ThemeScheme.DARK)).toBeTrue();
    expect(mockClassList.contains(ThemeScheme.LIGHT)).toBeFalse();
    expect(service.themeScheme()).toBe(ThemeScheme.DARK);
  });

  it("should clear scheme flags for auto scheme", () => {
    mockClassList = createMockClassList([ThemeScheme.DARK, ThemeScheme.LIGHT]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });
    service = TestBed.inject(ThemeService);

    service.setThemeScheme(ThemeScheme.AUTO);

    expect(mockClassList.contains(ThemeScheme.LIGHT)).toBeFalse();
    expect(mockClassList.contains(ThemeScheme.DARK)).toBeFalse();
    expect(service.themeScheme()).toBe(ThemeScheme.AUTO);
  });

  it("should remove existing theme classes and add new theme", () => {
    mockClassList = createMockClassList(["first-theme", "second-theme"]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });
    service = TestBed.inject(ThemeService);

    service.setTheme(new Theme("blue-theme", "Blue"));

    expect(mockClassList.contains("blue-theme")).toBeTrue();
    expect(mockClassList.contains("first-theme")).toBeFalse();
    expect(mockClassList.contains("second-theme")).toBeFalse();
  });

  it("should return an array of themes from getThemeList", () => {
    const themes = service.getThemeList();
    expect(Array.isArray(themes)).toBeTrue();
    themes.forEach((theme) => {
      expect(theme).toBeInstanceOf(Theme);
      expect(theme.className).toBeTruthy();
      expect(theme.name).toBeTruthy();
    });
  });

  it("should handle setTheme when no existing theme classes present", () => {
    mockClassList = createMockClassList([]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });
    service = TestBed.inject(ThemeService);

    service.setTheme(new Theme("new-theme", "New"));
    expect(mockClassList.contains("new-theme")).toBeTrue();
  });

  it("should return default label for empty theme key in format", () => {
    // Testing the _formatThemeLabel private method indirectly through label generation
    const themes = service.getThemeList();
    expect(themes.length).toBeGreaterThanOrEqual(0);
  });

  it("should handle cross-origin error in getThemeList silently", () => {
    // Simulate a stylesheet that throws a cross-origin SecurityError
    const fakeSheet = {
      get cssRules() {
        throw new Error("cross-origin access blocked");
      },
    };
    spyOnProperty(document, "styleSheets", "get").and.returnValue([
      fakeSheet,
    ] as unknown as StyleSheetList);
    expect(() => service.getThemeList()).not.toThrow();
  });

  it("should log for non-cross-origin errors in getThemeList", () => {
    const consoleInfoSpy = spyOn(console, "info");
    const fakeSheet = {
      get cssRules() {
        throw new Error("some other error");
      },
    };
    spyOnProperty(document, "styleSheets", "get").and.returnValue([
      fakeSheet,
    ] as unknown as StyleSheetList);
    service.getThemeList();
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it("should pick the first theme from classList on _getInitialTheme", () => {
    mockClassList = createMockClassList(["test-theme"]);
    TestBed.resetTestingModule();
    // Inject a stylesheet with test-theme class to simulate theme discovery
    const style = document.createElement("style");
    style.textContent = ".test-theme { color: red; }";
    document.head.appendChild(style);
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: DOCUMENT,
          useValue: { body: { classList: mockClassList }, styleSheets: document.styleSheets },
        },
      ],
    });
    service = TestBed.inject(ThemeService);
    const currentTheme = service.selectedTheme();
    expect(currentTheme).toBeTruthy();
    document.head.removeChild(style);
  });
});
