import { describe, it, expect, vi, afterEach, MockInstance } from "vitest";

describe("Math.random with spyOn", () => {
  let spy: MockInstance<() => number>;

  afterEach(() => {
    spy.mockRestore();
  });

  it("Math.random return 1", () => {
    spy = vi.spyOn(Math, "random").mockImplementation(() => 1);

    expect(Math.random()).toBe(1);
  });

  it("Math.random return under 1", () => {
    expect(Math.random()).toBeLessThan(1);
    expect(Math.random() < 1).toBe(true);
  });
});
