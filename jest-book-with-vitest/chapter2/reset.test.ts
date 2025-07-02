import { describe, it, expect, vi, beforeEach } from "vitest";

describe("#reset mocks with vi.fn", () => {
  const targetDate = "2020-12-25";
  const mockDate = new Date("2019-12-25"); // targetDateの1年前

  beforeEach(() => {
    globalThis.Date = vi.fn(() => mockDate) as any;
  });

  it("vi.clearAllMocks", () => {
    // 初期アサーション
    expect(new Date(targetDate)).toEqual(mockDate);
    expect(vi.mocked(Date).mock.calls).toEqual([["2020-12-25"]]);
    expect(vi.mocked(Date).mock.results).toEqual([
      { type: "return", value: mockDate },
    ]);

    // リセット
    vi.clearAllMocks();
    expect(vi.mocked(Date).mock.calls).toEqual([]);
    expect(vi.mocked(Date).mock.results).toEqual([]);
    expect(new Date(targetDate)).toEqual(mockDate);
  });

  it("vi.resetAllMocks", () => {
    // 初期アサーション
    expect(new Date(targetDate)).toEqual(mockDate);
    expect(vi.mocked(Date).mock.calls).toEqual([["2020-12-25"]]);
    expect(vi.mocked(Date).mock.results).toEqual([
      { type: "return", value: mockDate },
    ]);

    vi.resetAllMocks();
    expect(vi.mocked(Date).mock.calls).toEqual([]);
    expect(vi.mocked(Date).mock.results).toEqual([]);

    // モック関数のまま...？
    expect(new Date(targetDate)).toBe(mockDate);
  });

  it("vi.restoreAllMocks", () => {
    // 初期アサーション
    expect(new Date(targetDate)).toEqual(mockDate);
    expect(vi.mocked(Date).mock.calls).toEqual([["2020-12-25"]]);
    expect(vi.mocked(Date).mock.results).toEqual([
      { type: "return", value: mockDate },
    ]);

    vi.restoreAllMocks();
    expect(vi.mocked(Date).mock.calls).toEqual([]);
    expect(vi.mocked(Date).mock.results).toEqual([]);

    // モック関数のまま...？
    expect(new Date(targetDate)).toBe(mockDate);
  });
});
