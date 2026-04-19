import { Notification, ProgressNotification } from "./notification";
import { STAGE } from "./progress";

describe("Notification", () => {
  it("should create an instance with default values", () => {
    const before = new Date();
    const notif = new Notification({ severity: "warn", message: "message" });

    expect(notif.id).toBeTruthy();
    expect(notif.severity).toBe("warn");
    expect(notif.message).toBe("message");
    expect(notif.persistent).toBeTrue();
    expect(notif.show).toBeTrue();
    expect(notif.date.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it("should preserve provided metadata", () => {
    const date = new Date(2020, 0, 1);
    const notif = new Notification({
      severity: "info",
      message: "hello",
      date,
      ref: "test-ref",
      persistent: false,
      show: false,
    });

    expect(notif.date).toBe(date);
    expect(notif.ref).toBe("test-ref");
    expect(notif.persistent).toBeFalse();
    expect(notif.show).toBeFalse();
  });

  it("should support progress notification updates", () => {
    const notif = new ProgressNotification({ severity: "info", message: "progress" });

    expect(notif.progress.stage).toBe(STAGE.PENDING);
    expect(notif.progress.position.value).toBe(0);
    expect(notif.progress.position.total).toBe(-1);

    notif.setProgress(5, 10, STAGE.PROGRESS);
    expect(notif.progress.position.value).toBe(5);
    expect(notif.progress.position.total).toBe(10);
    expect(notif.progress.stage).toBe(STAGE.PROGRESS);

    notif.setProgress(12);
    expect(notif.progress.position.value).toBe(12);
    expect(notif.progress.position.total).toBe(12);
  });
});
