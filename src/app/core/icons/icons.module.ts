import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconsService } from "./services/icons.service";

/**
 * this factory is required to ensure the incolib is fully loaded on IconService import
 *
 */
function initWithDependencyFactory(iconsService: IconsService) {
	return async () => {
		console.log("initWithDependencyFactory - started");
		return iconsService.loadConfiguration().then(() => {
			console.log("initWithDependencyFactory - completed");
		});
	};
}
@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [
		// "easy" way to inforce service initialization
		IconsService,
		{
			provide: APP_INITIALIZER,
			useFactory: initWithDependencyFactory,
			deps: [IconsService],
			multi: true,
		},
	],
})
export class IconsModule {
	/** guard to avoid multiple import */
	constructor(@Optional() @SkipSelf() core: IconsModule) {
		if (core) {
			throw new Error(
				"You should import IconsModule module only in the root module"
			);
		}
	}
}
