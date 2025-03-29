import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { lastValueFrom } from "rxjs";
import { Category, NAMESPACE } from "../models/category";

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

  private iconlib = new Category("root");

  async loadConfiguration() {
    const libData = await lastValueFrom(this.http.get("assets/iconlib.json"));
    this.iconlib = this.load(libData as IconLibFormat);
    console.info("[IconsService] iconlib build: ", this.iconlib);
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
  getIconslib(): Category {
    return this.iconlib;
  }
}
