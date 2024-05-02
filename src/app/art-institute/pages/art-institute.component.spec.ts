import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtInstituteComponent } from "./art-institute.component";
import { TabsNavComponent } from "src/app/shared/components/tabs-nav/tabs-nav.component";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("ArtInstituteComponent", () => {
	let component: ArtInstituteComponent;
	let fixture: ComponentFixture<ArtInstituteComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ArtInstituteComponent],
			imports: [
				TabsNavComponent,
				RouterTestingModule.withRoutes([]),
				NoopAnimationsModule,
			],
		});
		fixture = TestBed.createComponent(ArtInstituteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
