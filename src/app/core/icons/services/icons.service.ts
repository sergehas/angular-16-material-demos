import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Category, NAMESPACE } from "../models/category";
import { HttpClient } from "@angular/common/http";

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
		console.log("iconlib build: ", this.iconlib);
	}

	constructor(
		private http: HttpClient,
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer
	) {}

	private load(data: incoLibFormat) {
		const cat = new Category(data.name);
		data.icons.map((i) => {
			const icon = cat.addIcon(i);
			console.log(`registering ${icon.name} in ${NAMESPACE}`);
			this.matIconRegistry.addSvgIconInNamespace(
				NAMESPACE,
				icon.name.split(":")[1], //remove namespace from name
				this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
			);
		});
		data.categories.map((c) => {
			cat.categories.push(this.load(c));
		});
		return cat;
	}
	public getIconslib() {
		return this.iconlib;
	}
}
