import { TestBed } from "@angular/core/testing";
import { HttpService } from "./http-service";
import { HttpClientModule } from "@angular/common/http";

describe("Http-Service", () => {
	let service: HttpService<any>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(HttpService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
