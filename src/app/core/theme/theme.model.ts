/**
 * Represents a UI theme with a CSS class name and display name.
 */
export class Theme {
  readonly className: string;
  readonly name: string;

  /**
   * Creates a new theme instance.
   * @param className The CSS class name for the theme
   * @param name The display name of the theme
   */
  constructor(className: string, name: string) {
    this.className = className;
    this.name = name;
  }

  /**
   * Checks if this theme is equal to another theme.
   * @param other The theme to compare with
   * @returns True if the themes have the same className
   */
  equals(other: Theme | undefined): boolean {
    return !!other && this.className === other.className;
  }
}

/**
 * Constants for theme color schemes.
 */
export class ThemeScheme {
  static readonly LIGHT = "light";
  static readonly DARK = "dark";
  static readonly AUTO = "auto";
}
