import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Category, NAMESPACE } from "../models/category";

type incoLibFormat = {
  name: string;
  icons: string[];
  categories: incoLibFormat[];
};

@Injectable({
  providedIn: "root",
})
export class IconsService {
  private iconlib = new Category("root");

  async loadConfiguration() {
    const libData = await this.http.get("assets/iconlib.json").toPromise();
    this.iconlib = this.load(libData as incoLibFormat);
    console.info("[IconsService] iconlib build: ", this.iconlib);
  }

  constructor(
    private readonly http: HttpClient,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) { }

  private load(data: incoLibFormat) {
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
