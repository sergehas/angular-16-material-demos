import { ComponentFixture, inject, TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Category } from "src/app/core/icons/models/category";
import { IconsService } from "src/app/core/icons/services/icons.service";
import { DemoModule } from "../../demo.module";
import { DemoIconsComponent } from "./demo-icons.component";

/**
 * Mock implementation of IconService for testing purposes.
 */
class MockIconsService {
  getIconslib(): Category {
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
      imports: [DemoModule, NoopAnimationsModule],
      declarations: [DemoIconsComponent],
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
