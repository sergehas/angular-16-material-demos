import { ComponentFixture, inject, TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Category } from "@app/core/icons/models/category";
import { IconsService } from "@app/core/icons/services/icons.service";
import { DemoIconsComponent } from "./demo-icons.component";

/**
 * Mock implementation of IconService for testing purposes.
 */
class MockIconsService {
  getIconsLib(): Category {
    const r = new Category("root");
    r.addCategory("brands").addIcon("azure");
    return r;
  }
}

describe("DemoIconsComponent", () => {
  let component: DemoIconsComponent;
  let fixture: ComponentFixture<DemoIconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoIconsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: IconsService, useClass: MockIconsService },
        // { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DemoIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject(
    [MatIconRegistry, DomSanitizer],
    (mir: MatIconRegistry, sanitizer: DomSanitizer) => {
      // The `MatIconRegistry` will make GET requests to fetch any SVG icons that are in the registry. More on this below...
      const sanitizedUrl = sanitizer.bypassSecurityTrustResourceUrl("/fakeIconPath");
      // Make sure that the icon name matches the icon name your component would be looking up.
      mir.addSvgIconInNamespace("parameter", "brands-azure", sanitizedUrl);
    }
  ));

  it("should create", async () => {
    expect(component).toBeTruthy();
  });
});
