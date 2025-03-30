import { CommonModule } from "@angular/common";
import { NgModule, inject } from "@angular/core";
import { GithubService } from "./services/github.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [GithubService],
})
export class GithubModule {
  /** guard to avoid multiple import */
  constructor() {
    const core = inject(GithubModule, { optional: true, skipSelf: true });

    if (core) {
      throw new Error("You should import GithubModule module only in the root module");
    }
  }
}
