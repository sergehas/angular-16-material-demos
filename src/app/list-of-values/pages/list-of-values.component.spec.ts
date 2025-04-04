import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { Observable } from "rxjs";
import { GroupsService } from "src/app/core/value-list/services/groups.service";
import { ValuesService } from "src/app/core/value-list/services/values.service";
import { TabsNavComponent } from "src/app/shared/components/tabs-nav/tabs-nav.component";
import { ListOfValuesComponent } from "./list-of-values.component";

/**
 * Mock implementation of GroupsService for testing purposes.
 */
class MockGroupsService {
  count(): Observable<number> {
    return new Observable((observer) => observer.next(11));
  }
}

/**
 * Mock implementation of ValuesService for testing purposes.
 */
class MockValuesService {
  getValues() {
    return ["Value1", "Value2", "Value3"];
  }
  count(): Observable<number> {
    return new Observable((observer) => observer.next(101));
  }
}

describe("ListOfValuesComponent", () => {
  let component: ListOfValuesComponent;
  let fixture: ComponentFixture<ListOfValuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TabsNavComponent,
        RouterModule.forRoot([]),
        NoopAnimationsModule,
        ListOfValuesComponent,
      ],
      providers: [
        ListOfValuesComponent,
        { provide: GroupsService, useClass: MockGroupsService },
        { provide: ValuesService, useClass: MockValuesService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
