import axios from "axios";
import Users from "./users";
import { expect, test, vi } from "vitest";

vi.mock("axios");

test("should fetch all users", async () => {
  const users = [{ name: "Bob" }];
  const resp = { data: users };

  // axiosのgetメソッドをモック化してrespを返すように設定
  vi.mocked(axios.get).mockResolvedValue(resp);

  // Users.search()を実行して、usersが返ることをアサーション
  await expect(Users.search()).resolves.toEqual(users);
  expect(await Users.search()).toEqual(users);
});
