import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { NAMESPACE } from "../models/category";

import { IconsService } from "./icons.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("IconsService", () => {
  let service: IconsService;
  let httpTestingController: HttpTestingController;
  let iconRegistry: MatIconRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    httpTestingController = TestBed.inject(HttpTestingController);
    iconRegistry = TestBed.inject(MatIconRegistry);
    service = TestBed.inject(IconsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should load configuration", () => {
    service.loadConfiguration().then(() => {
      expect(service.getIconslib().name).toEqual("numbers");
      expect(iconRegistry.getNamedSvgIcon(`${NAMESPACE}:1`)).toBeTruthy();
      expect(iconRegistry.getNamedSvgIcon(`${NAMESPACE}:2`)).toBeTruthy();
    });
    const req = httpTestingController.expectOne("assets/iconlib.json");
    expect(req.request.method).toEqual("GET");
    req.flush({ name: "numbers", icons: ["1.svg", "2.svg"], categories: [] });
    httpTestingController.verify();
  });
});
