import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { TabsNavComponent } from "./tabs-nav.component";
import { Router } from "@angular/router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("TabsNavComponent", () => {
	let component: TabsNavComponent;
	let fixture: ComponentFixture<TabsNavComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TabsNavComponent,
				RouterTestingModule.withRoutes([]),
				NoopAnimationsModule,
			],
		});
		fixture = TestBed.createComponent(TabsNavComponent);
		TestBed.inject(Router);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
