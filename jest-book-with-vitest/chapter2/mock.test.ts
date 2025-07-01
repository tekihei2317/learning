import { describe, test, expect, vi } from "vitest";

describe("vi.fn()", () => {
  test("mockFunction関数の結果は`undefined`である", () => {
    const mockFunction = vi.fn();
    expect(mockFunction()).toBeUndefined();
  });

  test("mockプロパティを持っている", () => {
    const mockFunction = vi.fn();
    expect(mockFunction).toHaveProperty("mock");
  });

  test("mockにはcallsプロパティを持っている", () => {
    const mockFunction = vi.fn();
    expect(mockFunction.mock).toHaveProperty("calls");
  });

  test("1回呼び出された", () => {
    const mockFunction = vi.fn();
    mockFunction();

    expect(mockFunction.mock.calls).toHaveLength(1);
  });

  test("1回呼び出された際に、引数は'foo'と'bar'だった", () => {
    const mockFunction = vi.fn();
    mockFunction("foo", "bar");

    expect(mockFunction.mock.calls[0]).toEqual(["foo", "bar"]);
    expect(mockFunction).toHaveBeenCalledWith("foo", "bar");
  });

  test("mockにはresultsプロパティを持っている", () => {
    const mockFunction = vi.fn();
    mockFunction("foo", "bar");

    expect(mockFunction.mock).toHaveProperty("results");
  });

  test("1回呼び出された(results)", () => {
    const mockFunction = vi.fn();
    mockFunction("foo", "bar");

    expect(mockFunction.mock.results).toHaveLength(1);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test("1回目の返り値はundefinedである", () => {
    const mockFunction = vi.fn();
    mockFunction("foo", "bar");

    expect(mockFunction.mock.results[0].value).toBeUndefined();
  });

  test("1回目の呼び出しが正常終了した", () => {
    const mockFunction = vi.fn();
    mockFunction("foo", "bar");

    expect(mockFunction.mock.results[0].type).toBe("return");
  });
});

// mockImplementationで返り値を設定
test("return `Hello`", () => {
  const mockFunction = vi.fn(() => "Hello");

  expect(mockFunction()).toBe("Hello");
});

// mockImplementationOnceで呼び出し毎に異なる返り値を設定
test("1回目の呼び出しでHelloを返す", () => {
  const mockFunction = vi
    .fn()
    .mockImplementationOnce(() => "Hello")
    .mockImplementationOnce(() => "Goodbye");

  expect(mockFunction()).toBe("Hello");
});

test("2回目の呼び出しでGoodbyeを返す", () => {
  const mockFunction = vi
    .fn()
    .mockImplementationOnce(() => "Hello")
    .mockImplementationOnce(() => "Goodbye");

  mockFunction(); // 1回目を消費
  expect(mockFunction()).toBe("Goodbye");
});

test("3回目の呼び出しでundefinedを返す", () => {
  const mockFunction = vi
    .fn()
    .mockImplementationOnce(() => "Hello")
    .mockImplementationOnce(() => "Goodbye");

  mockFunction(); // 1回目を消費
  mockFunction(); // 2回目を消費
  expect(mockFunction()).toBe(undefined);
});
