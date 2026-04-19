import { InstanceofPipe } from "./instanceof.pipe";

describe("InstanceofPipe", () => {
  let pipe: InstanceofPipe;

  beforeEach(() => {
    pipe = new InstanceofPipe();
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return true when value is an instance of the given type", () => {
    const date = new Date();
    expect(pipe.transform(date, Date)).toBeTrue();
  });

  it("should return false when value is not an instance of the given type", () => {
    const str = "not a date";
    expect(pipe.transform(str, Date)).toBeFalse();
  });

  it("should return false for null value", () => {
    expect(pipe.transform(null, Date)).toBeFalse();
  });

  it("should return true for instances of custom classes", () => {
    class MyClass {}
    const instance = new MyClass();
    expect(pipe.transform(instance, MyClass)).toBeTrue();
  });

  it("should return false for instances of unrelated classes", () => {
    class ClassA {}
    class ClassB {}
    const instance = new ClassA();
    expect(pipe.transform(instance, ClassB)).toBeFalse();
  });
});
