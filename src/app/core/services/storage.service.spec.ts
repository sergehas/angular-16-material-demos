import { StorageService } from "./storage.service";

const storageKey = "scopes";
const scopes = ["edit:messages", "approve:budget", "read:dashboard"];

describe("StorageService", () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService(sessionStorage);

    const store: Map<string, string> = new Map();
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store.keys ? store.get(key) ?? "" : null;
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

    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, "setItem").and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, "removeItem").and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, "clear").and.callFake(mockLocalStorage.clear);
  });

  it("should create the service", () => {
    expect(service).toBeTruthy();
  });

  describe("setItem", () => {
    it("should serialize and store the scopes in localStorage", () => {
      service.setItem(storageKey, scopes).subscribe((x) => expect(x).toEqual(scopes));
    });
  });

  describe("getItem", () => {
    it("should retrieve, deserialize scopes in localStorage and returns subscription for any changes there on after", () => {
      service.setItem(storageKey, scopes).subscribe((_x) => {
        verifyScopesInLocalStorage();
      });
    });

    function verifyScopesInLocalStorage() {
      service.getItem(storageKey)?.subscribe((y) => {
        expect(y).toEqual(scopes);
      });
    }
  });

  describe("removeItem", () => {
    it("should remove scopes in localStorage and notify all subscribers, and subscription payload will be null for removal", () => {
      service.removeItem(storageKey);
      service.getItem(storageKey)?.subscribe((x) => {
        expect(x).toEqual(undefined);
      });
    });
  });
});
