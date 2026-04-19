import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { Notification } from "@app/core/notifications/models/notification";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should cache persistent notifications and expose notifications$", fakeAsync(() => {
    const n1 = new Notification({ severity: "info", message: "msg" });
    const n2 = new Notification({ severity: "info", message: "msg2" });
    const emissions: Set<Notification>[] = [];

    service.notifications$.subscribe((set) => emissions.push(set));

    expect(emissions[0].size).toBe(0);
    service.notify(n1);
    tick();
    expect(emissions[1].has(n1)).toBeTrue();
    service.notify(n2);
    tick();
    expect(emissions[2].has(n2)).toBeTrue();
    expect(emissions[2].size).toBe(2);

    service.dismiss(n2);
    tick();
    expect(emissions[3].has(n1)).toBeTrue();
    expect(emissions[3].has(n2)).toBeFalse();
    expect(emissions[3].size).toBe(1);

    service.clear();
    tick();
    expect(emissions[4].size).toBe(0);
  }));

  it("should not propagate notification$ when propagate is false", fakeAsync(() => {
    let received: Notification | undefined;
    service.notification$.subscribe((notif) => (received = notif));
    const notif = new Notification({ severity: "info", message: "hidden", persistent: false });

    service.notify(notif, false);
    tick();

    expect(received).toBeUndefined();
  }));

  it("should update cache state on load and update operations", fakeAsync(() => {
    const notif = new Notification({ severity: "info", message: "msg" });
    const emissions: Set<Notification>[] = [];

    service.notifications$.subscribe((set) => emissions.push(set));
    service.notify(notif);
    tick();
    expect(emissions[1].has(notif)).toBeTrue();

    service.load();
    tick();
    expect(emissions[2].has(notif)).toBeTrue();

    (notif as unknown as { persistent: boolean }).persistent = false;
    service.update(notif);
    tick();
    expect(emissions[3].has(notif)).toBeFalse();
    expect(emissions[3].size).toBe(0);
  }));

  it("should add a new persistent notification when update is called", fakeAsync(() => {
    const notif = new Notification({ severity: "info", message: "updated", persistent: true });
    const emissions: Set<Notification>[] = [];

    service.notifications$.subscribe((set) => emissions.push(set));
    expect(emissions[0].size).toBe(0);

    service.update(notif);
    tick();

    expect(emissions[1].has(notif)).toBeTrue();
    expect(emissions[1].size).toBe(1);
  }));

  it("should dismiss even non-cached notifications without throwing", () => {
    const nonCached = new Notification({
      severity: "info",
      message: "no-cache",
      persistent: false,
    });

    expect(() => service.dismiss(nonCached)).not.toThrow();
    service.notifications$.subscribe((set) => expect(set.size).toBe(0));
  });
});
