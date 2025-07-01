import { Greeter } from "./Greeter";
import { describe, it, expect } from "vitest";

describe("Greeter", () => {
  it("Says Hello and name", () => {
    const greeter = new Greeter();
    expect(greeter.greet("Taka")).toBe("Hello, Taka!");
    expect(greeter.greet("Daniel")).toBe("Hello, Daniel!");
  });

  it.each([
    ["Taka", "Hello, Taka!"],
    ["Daniel", "Hello, Daniel!"],
  ])("Says Hello and %s, expecting %s", (name, expected) => {
    const greeter = new Greeter();
    expect(greeter.greet(name)).toBe(expected);
  });

  it.each`
    name        | expected
    ${"Tanaka"} | ${"Hello, Tanaka!"}
    ${"Daniel"} | ${"Hello, Daniel!"}
  `("Says Hello and $name, expecting $expected ", ({ name, expected }) => {
    const greeter = new Greeter();
    expect(greeter.greet(name)).toBe(expected);
  });
});
