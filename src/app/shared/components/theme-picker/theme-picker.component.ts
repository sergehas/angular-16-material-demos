import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  effect,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DomSanitizer } from "@angular/platform-browser";
import { Theme } from "@app/core/theme/theme.model";
import { ThemeService } from "@app/core/theme/theme.service";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-theme-picker",
  templateUrl: "theme-picker.component.html",
  styleUrls: ["theme-picker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    TranslatePipe,
  ],
})
export class ThemePickerComponent {
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly themes = this.themeService.getThemeList();
  protected currentTheme?: Theme;

  constructor() {
    // Register the theme color icon
    this.iconRegistry.addSvgIcon(
      "theme-color",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/themes/theme-color-icon.svg")
    );

    // Subscribe to theme changes
    effect(async () => {
      const themeKey = this.themeService.selectedTheme();
      this.currentTheme = this.themes.find((theme) => theme.className === themeKey);
    });
  }

  selectTheme(themeKey: string): void {
    const theme = this.themes.find((t) => t.className === themeKey);
    if (!theme) {
      return;
    }
    this.themeService.setTheme(themeKey);
  }

  trackByThemeKey(_index: number, theme: Theme): string {
    return theme.className;
  }
}
