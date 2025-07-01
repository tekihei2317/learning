import { chohan } from "./chohan";
import { describe, expect, test, vi } from "vitest";

vi.mock("./seed", () => ({
  // seed: vi.fn().mockReturnValueOnce(2).mockReturnValueOnce(1),
  seed: vi
    .fn()
    .mockImplementationOnce(() => 2)
    .mockImplementationOnce(() => 1),
}));

describe("chohan", () => {
  test("returns 丁 when seed returns an even number like 2", () => {
    expect(chohan()).toBe("丁");
  });

  test("returns 半 when seed returns an odd number like 1", () => {
    expect(chohan()).toBe("半");
  });
});
