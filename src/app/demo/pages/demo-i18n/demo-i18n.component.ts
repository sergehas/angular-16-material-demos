import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "app-demo-i18n",
	templateUrl: "./demo-i18n.component.html",
	styleUrls: ["./demo-i18n.component.scss"],
})
export class DemoI18nComponent {
	today = new Date();

	constructor(private translateService: TranslateService) {}

	setLanguage(locale: string) {
		this.translateService.use(locale);
	}
}
