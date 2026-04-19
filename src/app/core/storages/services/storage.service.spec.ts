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

    it("should notify cached subscribers when removing an existing item", () => {
      service.setItem(storageKey, scopes);
      let lastValue: unknown;
      service.getItem(storageKey)?.subscribe((v) => (lastValue = v));
      service.removeItem(storageKey);
      expect(lastValue).toBeUndefined();
    });

    it("should not throw when removing a key that was never set", () => {
      expect(() => service.removeItem("non-existent-key")).not.toThrow();
    });
  });

  describe("getItem", () => {
    it("should return undefined when key does not exist in cache or storage", () => {
      const result = service.getItem("missing-key");
      expect(result).toBeUndefined();
    });

    it("should return cached BehaviorSubject when key was already set", () => {
      service.setItem(storageKey, scopes);
      const result = service.getItem(storageKey);
      expect(result).toBeTruthy();
      result?.subscribe((v) => expect(v).toEqual(scopes));
    });

    it("should create cache entry from storage when not in cache", () => {
      // Directly set in sessionStorage to simulate data existing without cache
      sessionStorage.setItem("direct-key", JSON.stringify(["a", "b"]));
      const result = service.getItem<string[]>("direct-key");
      expect(result).toBeTruthy();
      result?.subscribe((v) => expect(v).toEqual(["a", "b"]));
    });
  });

  describe("setItem", () => {
    it("should update existing cached subject when key already exists", () => {
      const subject1 = service.setItem(storageKey, scopes);
      const newScopes = ["read:admin"];
      const subject2 = service.setItem(storageKey, newScopes);
      expect(subject1).toBe(subject2); // same BehaviorSubject instance
      subject2.subscribe((v) => expect(v).toEqual(newScopes));
    });
  });
});
