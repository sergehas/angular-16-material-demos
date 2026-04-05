import { DOCUMENT, inject, Injectable, signal } from "@angular/core";

export type ThemeScheme = "light" | "dark" | "auto";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly _body = inject(DOCUMENT).body;

  themeScheme = signal<ThemeScheme>(this._body.classList.contains("dark") ? "dark" : "light");

  setThemeScheme(scheme: ThemeScheme): void {
    switch (scheme) {
      case "light":
        this._body.classList.remove("dark");
        this._body.classList.add("light");
        break;
      case "dark":
        this._body.classList.remove("light");
        this._body.classList.add("dark");
        break;
      default: //case "auto":
        this._body.classList.remove("light", "dark");
        break;
    }
    this.themeScheme.set(this._body.classList.contains("dark") ? "dark" : "light");
  }

  setTheme(theme: string): void {
    // Remove existing theme classes
    this._body.classList.forEach((className) => {
      if (className.endsWith("-theme")) {
        this._body.classList.remove(className);
      }
    });
    // Add the new theme class
    this._body.classList.add(`${theme}-theme`);
  }
}
