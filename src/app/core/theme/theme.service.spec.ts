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

  /**
   * creates a mock classList object that simulates the behavior of the DOMTokenList used in the document body classList.
   * It provides methods to add, remove, check for the presence of classes, and iterate over the classes.
   * classes are either Theme schemes or theme keys with -theme suffix (so theme names).
   */
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

  it("should be created and use the document body scheme list", () => {
    expect(service).toBeTruthy();
    expect(service.themeScheme()).toBe(ThemeScheme.DARK);
  });

  it("should switch to light theme scheme", () => {
    service.setThemeScheme("light");

    expect(mockClassList.contains(ThemeScheme.LIGHT)).toBeTrue();
    expect(mockClassList.contains(ThemeScheme.DARK)).toBeFalse();
    expect(service.themeScheme()).toBe(ThemeScheme.LIGHT);
  });

  it("should switch to dark theme scheme", () => {
    service.setThemeScheme(ThemeScheme.DARK);

    expect(mockClassList.contains(ThemeScheme.DARK)).toBeTrue();
    expect(mockClassList.contains(ThemeScheme.LIGHT)).toBeFalse();
    expect(service.themeScheme()).toBe(ThemeScheme.DARK);
  });

  it("should clear scheme flags for auto scheme and default to light when dark is absent", () => {
    service.setThemeScheme(ThemeScheme.AUTO);

    expect(mockClassList.contains(ThemeScheme.LIGHT)).toBeFalse();
    expect(mockClassList.contains(ThemeScheme.DARK)).toBeFalse();
    expect(service.themeScheme()).toBe(ThemeScheme.AUTO);
  });

  it("should remove existing theme classes and add the selected theme class", () => {
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
});
