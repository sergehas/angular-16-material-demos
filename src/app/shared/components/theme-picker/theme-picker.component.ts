import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DomSanitizer } from "@angular/platform-browser";
import { Theme, ThemeScheme } from "@app/core/theme/theme.model";
import { ThemeService } from "@app/core/theme/theme.service";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-theme-picker",
  templateUrl: "theme-picker.component.html",
  styleUrls: ["theme-picker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    TranslatePipe,
    MatButtonToggleModule,
    MatListModule,
    FormsModule,
  ],
})
export class ThemePickerComponent {
  private readonly themeService = inject(ThemeService);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly themes = this.themeService.getThemeList();
  protected currentTheme?: Theme;
  protected currentScheme?: ThemeScheme;

  constructor() {
    // Register the theme color icon
    this.iconRegistry.addSvgIcon(
      "theme-color",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/themes/theme-color-icon.svg")
    );

    // Subscribe to theme changes
    effect(async () => {
      this.currentTheme = this.themeService.selectedTheme();
      this.currentScheme = this.themeService.themeScheme();
    });
  }

  selectTheme(theme: Theme): void {
    const selectedTheme = this.themes.find((t) => t.className === theme.className);
    if (!selectedTheme) {
      return;
    }
    this.themeService.setTheme(selectedTheme);
  }

  selectScheme(scheme: ThemeScheme | undefined): void {
    this.themeService.setThemeScheme(scheme ? scheme : ThemeScheme.AUTO);
  }

  trackByThemeKey(_index: number, theme: Theme): string {
    return theme.className;
  }
}
