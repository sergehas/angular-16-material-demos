import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Category, NAMESPACE } from "@app/core/icons/models/category";
import { lastValueFrom } from "rxjs";

interface IconLibFormat {
  name: string;
  icons: string[];
  categories: IconLibFormat[];
}

@Injectable({
  providedIn: "root",
})
export class IconsService {
  private readonly http = inject(HttpClient);
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  private iconLib = new Category("root");

  /**
   * load configuration from json file and build iconLib structure
   * and register icons in matIconRegistry
   * should be called during app initialization (see IconsModule)
   */
  async loadConfiguration() {
    const libData = await lastValueFrom(this.http.get("assets/iconLib.json"));
    this.iconLib = this.load(libData as IconLibFormat);
    console.info("[IconsService] iconLib build: ", this.iconLib);
  }

  private load(data: IconLibFormat) {
    const cat = new Category(data.name);
    data.icons.forEach((i) => {
      const icon = cat.addIcon(i);
      console.debug(`[IconsService] registering ${icon.name} in ${NAMESPACE}`);
      this.matIconRegistry.addSvgIconInNamespace(
        NAMESPACE,
        icon.name.split(":")[1], //remove namespace from name
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    });
    data.categories.forEach((c) => {
      cat.categories.push(this.load(c));
    });
    return cat;
  }
  getIconsLib(): Category {
    return this.iconLib;
  }
}
