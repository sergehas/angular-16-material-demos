import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";

import { Category } from "@app/core/icons/models/category";
import { IconsService } from "@app/core/icons/services/icons.service";
import { IconTreeComponent } from "./icon-tree.component";

describe("IconTreeComponent", () => {
  let component: IconTreeComponent;
  let fixture: ComponentFixture<IconTreeComponent>;
  let mockIconsService: jasmine.SpyObj<IconsService>;

  beforeEach(() => {
    const category = { categories: [] as Category[] } as Category;
    mockIconsService = jasmine.createSpyObj("IconsService", ["getIconsLib"]);
    mockIconsService.getIconsLib.and.returnValue(category);

    TestBed.configureTestingModule({
      imports: [IconTreeComponent],
      providers: [{ provide: IconsService, useValue: mockIconsService }],
    });
    fixture = TestBed.createComponent(IconTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Component Initialization", () => {
    function createComponentWithMockLib(mockCategories: Category | undefined): IconTreeComponent {
      mockIconsService.getIconsLib.and.returnValue(
        mockCategories ? mockCategories : (undefined as unknown as Category)
      );
      const fixture = TestBed.createComponent(IconTreeComponent);
      fixture.detectChanges();
      return fixture.componentInstance;
    }
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with null value", () => {
      expect(component.value()).toBeNull();
    });

    it("should initialize with expanded=true by default", () => {
      expect(component.expanded()).toBe(true);
    });

    it("should load categories from icons service when available", () => {
      const mockCategory: Category = new Category("Category1");
      mockCategory.categories.push(new Category("Subcategory1"));
      const comp = createComponentWithMockLib(mockCategory);
      expect(comp.dataSource.data).toEqual(mockCategory.categories);
    });

    it("should handle undefined icons lib gracefully", () => {
      const comp = createComponentWithMockLib(undefined as unknown as Category);
      expect(comp.dataSource.data).toEqual([]);
    });
  });

  describe("select() method", () => {
    it("should set value when selecting a new item", () => {
      component.select("icon-1");
      expect(component.value()).toBe("icon-1");
    });

    it("should emit valueChange when selecting a new item", () => {
      spyOn(component.valueChange, "emit");
      component.select("icon-1");
      expect(component.valueChange.emit).toHaveBeenCalledWith("icon-1");
    });

    it("should deselect item when clicking already selected item", () => {
      component.value.set("icon-1");
      component.select("icon-1");
      expect(component.value()).toBeNull();
    });

    it("should emit null when deselecting item", () => {
      component.value.set("icon-1");
      spyOn(component.valueChange, "emit");
      component.select("icon-1");
      expect(component.valueChange.emit).toHaveBeenCalledWith(null);
    });

    it("should switch selection from one item to another", () => {
      component.value.set("icon-1");
      spyOn(component.valueChange, "emit");
      component.select("icon-2");
      expect(component.value()).toBe("icon-2");
      expect(component.valueChange.emit).toHaveBeenCalledWith("icon-2");
    });
  });

  describe("hasChild() method", () => {
    it("should return true when node has non-empty categories", () => {
      const node: Category = new Category("Parent");
      node.categories.push(new Category("Child"));
      expect(component.hasChild(0, node)).toBe(true);
    });

    it("should return false when node has empty categories array", () => {
      const node: Category = new Category("Parent");
      expect(component.hasChild(0, node)).toBe(false);
    });

    it("should return false when node has no categories property", () => {
      const node: Category = new Category("Parent");
      expect(component.hasChild(0, node)).toBe(false);
    });
  });

  describe("childrenAccessor", () => {
    it("should return categories when present", () => {
      const child1: Category = { name: "Child1" } as Category;
      const child2: Category = { name: "Child2" } as Category;
      const node: Category = new Category("Parent");
      node.categories.push(child1);
      node.categories.push(child2);
      expect(component.childrenAccessor(node)).toEqual([child1, child2]);
    });

    it("should return empty array when categories undefined", () => {
      const node: Category = new Category("Parent");
      expect(component.childrenAccessor(node)).toEqual([]);
    });

    it("should return empty array when categories is null", () => {
      const node: Category = new Category("Parent");
      node.categories = null as unknown as Category[];
      expect(component.childrenAccessor(node)).toEqual([]);
    });
  });

  describe("expanded input and tree expansion", () => {
    it("should collapse tree when expanded signal is set to false", fakeAsync(() => {
      const spy = spyOn(component.tree(), "collapseAll");
      component.expanded.set(false);
      //require async as tree is available only after view init and effect runs on next tick
      fixture.detectChanges();
      tick();
      expect(spy).toHaveBeenCalled();
    }));

    it("should expand tree when expanded signal is set to true", fakeAsync(() => {
      component.expanded.set(false);
      fixture.detectChanges();
      const spy = spyOn(component.tree(), "expandAll");
      //require async as tree is available only after view init and effect runs on next tick
      component.expanded.set(true);
      fixture.detectChanges();
      tick();
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe("ngAfterViewInit", () => {
    it("should expand tree on init when expanded is true", () => {
      const spy = spyOn(component.tree(), "expandAll");
      component.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });

    it("should collapse tree on init when expanded is false", () => {
      const spy = spyOn(component.tree(), "collapseAll");
      fixture.componentRef.setInput("expanded", false);
      fixture.detectChanges();
      component.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
