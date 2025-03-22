import { NgModule, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GithubService } from "./services/github.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [GithubService],
})
export class GithubModule {
  /** guarde to avoid multiple import */
  constructor() {
    const core = inject(GithubModule, { optional: true, skipSelf: true });

    if (core) {
      throw new Error("You should import GithubModule module only in the root module");
    }
  }
}
