import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TableExpandableRowsComponent } from "./table-expandable-rows.component";

describe("TableExpandableRowsComponent", () => {
	let component: TableExpandableRowsComponent<any>;
	let fixture: ComponentFixture<TableExpandableRowsComponent<any>>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TableExpandableRowsComponent],
		});
		fixture = TestBed.createComponent(TableExpandableRowsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
