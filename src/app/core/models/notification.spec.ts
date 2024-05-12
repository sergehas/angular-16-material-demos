import { Notification } from "./notification";

describe("Notification", () => {
  it("should create an instance", () => {
    expect(new Notification({ severity: "info", message: "msg" })).toBeTruthy();
  });
});
