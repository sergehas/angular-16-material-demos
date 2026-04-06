import { DOCUMENT, inject, Injectable, signal } from "@angular/core";
import { Theme, ThemeScheme } from "./theme.model";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  static readonly THEME_CLASS_SUFFIX = "-theme";
  static readonly THEME_REGEX = new RegExp(
    `\\.(?<themeClass>\\w+${ThemeService.THEME_CLASS_SUFFIX})[\\s|$]`,
    "g"
  );
  static readonly THEME_CLASS_REGEX = new RegExp(
    `(?<themeClass>\\w+${ThemeService.THEME_CLASS_SUFFIX})`
  );

  private readonly _body = inject(DOCUMENT).body;
  private readonly _themes: Theme[] = [];
  selectedTheme = signal<Theme>(new Theme("default-theme", "default"));
  themeScheme = signal<ThemeScheme>(ThemeScheme.AUTO);

  constructor() {
    const isDark = this._body.classList.contains(ThemeScheme.DARK);
    if (isDark) {
      this.themeScheme.set(ThemeScheme.DARK);
    } else {
      const isLight = this._body.classList.contains(ThemeScheme.LIGHT);
      if (isLight) {
        this.themeScheme.set(ThemeScheme.LIGHT);
      }
    }
    this._themes.push(...this.getThemeList());
    this.selectedTheme.set(this._getInitialTheme());
  }
  /**
   * Sets the theme scheme for the application
   * @param scheme - The theme scheme to apply (LIGHT, DARK, or AUTO)
   * @description
   * Updates the application's theme by:
   * - Adding/removing appropriate theme classes from the body element
   * - Updating the internal theme scheme signal
   *
   * For LIGHT scheme: removes DARK class, adds LIGHT class
   * For DARK scheme: removes LIGHT class, adds DARK class
   * For AUTO scheme: removes both LIGHT and DARK classes, allowing system preference to take effect
   */
  setThemeScheme(scheme: ThemeScheme): void {
    switch (scheme) {
      case ThemeScheme.LIGHT:
        this._body.classList.remove(ThemeScheme.DARK);
        this._body.classList.add(ThemeScheme.LIGHT);
        break;
      case ThemeScheme.DARK:
        this._body.classList.remove(ThemeScheme.LIGHT);
        this._body.classList.add(ThemeScheme.DARK);
        break;
      default: //case ThemeScheme.AUTO:
        this._body.classList.remove(ThemeScheme.LIGHT, ThemeScheme.DARK);
        break;
    }
    this.themeScheme.set(scheme);
  }

  /**
   * Retrieves a list of available themes by parsing CSS stylesheets.
   *
   * This method scans all loaded stylesheets for CSS rules that match the theme class pattern
   * (e.g., `.className-theme`). It extracts unique theme class names and returns them as an
   * array of Theme objects, sorted alphabetically.
   *
   * Cross-origin stylesheets are silently skipped to prevent CORS errors.
   *
   * @returns {Theme[]} An array of Theme objects, starting with a default theme followed by
   *                    discovered themes sorted alphabetically by their class name.
   *
   * @example
   * const themes = themeService.getThemeList();
   * // Returns: [
   * //   Theme { className: 'blue-theme', label: 'Blue' },
   * //   Theme { className: 'red-theme', label: 'Red' }
   * // ]
   */
  getThemeList(): Theme[] {
    const themes: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        Array.from(sheet.cssRules)
          .filter((rule) => rule instanceof CSSStyleRule)
          .forEach((rule) => {
            for (const match of rule.selectorText.matchAll(ThemeService.THEME_REGEX)) {
              const className = match.groups?.["themeClass"];
              if (className && !themes.includes(`${className}`)) {
                console.log("[theme.service] Found theme class:", className);
                themes.push(`${className}`);
              }
            }
          });
      } catch (e: Error | unknown) {
        if (e instanceof Error && e.message.includes("cross")) {
          // Expected for cross-origin sheets, silently skip
        } else {
          console.info(
            "[theme.service] Unexpected error parsing stylesheets:",
            (e as Error).message
          );
        }
      }
    }
    return themes
      .sort((a, b) => a.localeCompare(b))
      .map((className) => new Theme(className, this._formatThemeLabel(className)));
  }

  setTheme(theme: Theme): void {
    // Remove existing theme classes safely (use 2 distinct loops to avoid modifying the classList while iterating)
    const toRemove: string[] = [];
    this._body.classList.forEach((className) => {
      const themeClass = className.match(ThemeService.THEME_CLASS_REGEX)?.groups?.["themeClass"];
      if (themeClass) {
        console.log("[theme.service] Marking theme class for removal:", themeClass);
        toRemove.push(className);
      }
    });
    toRemove.forEach((className) => this._body.classList.remove(className));
    // Add the new theme class
    this._body.classList.add(theme.className);
    this.selectedTheme.set(theme);
  }
  private _getInitialTheme(): Theme {
    // Get the currently applied theme from the body classes
    for (const theme of this._themes) {
      if (this._body.classList.contains(theme.className)) {
        return theme;
      }
    } //default theme is the first in the list
    return this._themes[0];
  }

  /**
   * Formats a theme key into a human-readable label.
   * E.g., "darkBlue" -> "Dark Blue", "my-theme" -> "My Theme"
   */
  private _formatThemeLabel(themeKey: string): string {
    if (!themeKey) return "default";
    // Replace hyphens/underscores with spaces, then insert spaces before capital letters
    const spaced = themeKey.replace(/[-_]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
    // Capitalize each word
    return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
