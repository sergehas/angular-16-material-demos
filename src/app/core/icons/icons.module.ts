import { CommonModule } from "@angular/common";
import { NgModule, inject, provideAppInitializer } from "@angular/core";
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
    // "easy" way to enforce service initialization
    IconsService,
    provideAppInitializer(() => {
      const initializerFn = initWithDependencyFactory(inject(IconsService));
      return initializerFn();
    }),
  ],
})
export class IconsModule {
  /** guard to avoid multiple import */
  constructor() {
    const core = inject(IconsModule, { optional: true, skipSelf: true });

    if (core) {
      throw new Error("You should import IconsModule module only in the root module");
    }
  }
}
