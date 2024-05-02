import { TestBed } from "@angular/core/testing";

import { GithubService } from "./github.service";
import { HttpClientModule } from "@angular/common/http";

describe("GithubService", () => {
	let service: GithubService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(GithubService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
