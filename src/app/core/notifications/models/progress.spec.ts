import { Progress, STAGE } from "./progress";

describe("Progress", () => {
  it("should create an instance", () => {
    expect(new Progress()).toBeTruthy();
  });

  it("should grow total when value exceeds current total", () => {
    const progress = new Progress();

    progress.position.total = 2;
    progress.position.value = 5;

    expect(progress.position.total).toBe(5);
    expect(progress.position.value).toBe(5);
  });

  it("should clamp value to total when total is set lower than current value", () => {
    const progress = new Progress();

    progress.position.value = 5;
    progress.position.total = 3;

    expect(progress.position.total).toBe(3);
    expect(progress.position.value).toBe(3);
  });

  it("should initialize with pending stage", () => {
    const progress = new Progress();

    expect(progress.stage).toBe(STAGE.PENDING);
    expect(progress.position.total).toBe(-1);
    expect(progress.position.value).toBe(0);
  });
});
