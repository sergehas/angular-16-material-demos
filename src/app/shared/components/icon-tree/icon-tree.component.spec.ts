import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Category } from "src/app/core/icons/models/category";
import { IconsService } from "src/app/core/icons/services/icons.service";
import { IconTreeComponent } from "./icon-tree.component";

describe("IconTreeComponent", () => {
  let component: IconTreeComponent;
  let fixture: ComponentFixture<IconTreeComponent>;

  beforeEach(() => {
    const category = { categories: [] as Category[] } as Category;
    //const iconsService = jasmine.createSpyObj('IconsService', ['getIconslib']);

    const iconsService: Partial<IconsService> = {
      getIconslib: () => {
        return category;
      },
    };
    TestBed.configureTestingModule({
      imports: [IconTreeComponent],
      providers: [{ provide: IconsService, useValue: iconsService }],
    });
    fixture = TestBed.createComponent(IconTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
