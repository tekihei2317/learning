function add(a: number, b: number): number {
  return a + b;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("add", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(10, 100)).toBe(110);
  });
}
