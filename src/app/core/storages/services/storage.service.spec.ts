import { TestBed } from "@angular/core/testing";
import { StorageService } from "./storage.service";

const storageKey = "scopes";
const scopes = ["edit:messages", "approve:budget", "read:dashboard"];

describe("StorageService", () => {
  let service: StorageService;

  beforeEach(() => {
    const store = new Map<string, string>();
    const mockSessionStorage = {
      getItem: (key: string): string | null => {
        return store.has(key) ? (store.get(key) ?? "") : null;
      },
      setItem: (key: string, value: string) => {
        store.set(key, `${value}`);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    };
    TestBed.configureTestingModule({
      providers: [StorageService, { provide: Storage, useValue: mockSessionStorage }],
    });

    service = TestBed.inject(StorageService);

    spyOn(sessionStorage, "getItem").and.callFake(mockSessionStorage.getItem);
    spyOn(sessionStorage, "setItem").and.callFake(mockSessionStorage.setItem);
    spyOn(sessionStorage, "removeItem").and.callFake(mockSessionStorage.removeItem);
    spyOn(sessionStorage, "clear").and.callFake(mockSessionStorage.clear);
  });

  it("should create the service", () => {
    expect(service).toBeTruthy();
  });

  describe("setItem", () => {
    it("should serialize and store the scopes in sessionStorage", () => {
      service.setItem(storageKey, scopes).subscribe((x) => expect(x).toEqual(scopes));
    });
  });

  describe("getItem", () => {
    it("should retrieve, deserialize scopes in sessionStorage and returns subscription for any changes there on after", () => {
      service.setItem(storageKey, scopes).subscribe((_x) => {
        verifyScopesInSessionStorage();
      });
    });

    function verifyScopesInSessionStorage() {
      service.getItem(storageKey)?.subscribe((y) => {
        expect(y).toEqual(scopes);
      });
    }
  });

  describe("removeItem", () => {
    it("should remove scopes in sessionStorage and notify all subscribers, and subscription payload will be null for removal", () => {
      service.removeItem(storageKey);
      service.getItem(storageKey)?.subscribe((x) => {
        expect(x).toEqual(undefined);
      });
    });
  });
});
