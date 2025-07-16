import { Effect, Option } from "effect";
import { SqlClient } from "@effect/sql";
import {
  getUserById,
  getUserByIdResolver,
  getUserByIdSchema,
} from "./resolver-get-user-by-id";
import { insertUserResolver } from "./resolver-insert-user";
import { testSqlClient } from "./sql-client";

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("getUserById", () => {
    it("ユーザーを取得できること", async () => {
      const testProgram = Effect.gen(function* () {
        const user = yield* (yield* insertUserResolver).insert({
          username: "testuser",
          bio: "I am testuser",
          profileImageUrl: "http://example.com/testuser.png",
        });

        const fetchedUser = yield* getUserById(user.id);

        expect(fetchedUser).toEqual({
          id: user.id,
          username: "testuser",
          bio: "I am testuser",
          image: "http://example.com/testuser.png",
        });
      }).pipe(Effect.provideServiceEffect(SqlClient.SqlClient, testSqlClient));

      await Effect.runPromise(Effect.scoped(testProgram));
    });
  });

  describe("getUserByIdResolver", () => {
    it("ユーザーを取得できること", async () => {
      const testProgram = Effect.gen(function* () {
        const user = yield* (yield* insertUserResolver).insert({
          username: "testuser",
          bio: "I am testuser",
          profileImageUrl: "http://example.com/testuser.png",
        });

        const fetchedUser = yield* getUserByIdResolver(user.id);

        expect(fetchedUser).toEqual({
          id: user.id,
          username: "testuser",
          bio: "I am testuser",
          image: "http://example.com/testuser.png",
        });
      });

      await Effect.runPromise(
        Effect.scoped(
          testProgram.pipe(
            Effect.provideServiceEffect(SqlClient.SqlClient, testSqlClient)
          )
        )
      );
    });
  });

  describe("getUserByIdSchema", () => {
    it("ユーザーを取得できること", async () => {
      const testProgram = Effect.gen(function* () {
        const user = yield* (yield* insertUserResolver).insert({
          username: "testuser",
          bio: "I am testuser",
          profileImageUrl: "http://example.com/testuser.png",
        });

        const fetchedUser = yield* (yield* getUserByIdSchema)(user.id);

        expect(Option.getOrThrow(fetchedUser)).toEqual({
          id: user.id,
          username: "testuser",
          bio: "I am testuser",
          image: "http://example.com/testuser.png",
        });
      });

      await Effect.runPromise(
        Effect.scoped(
          testProgram.pipe(
            Effect.provideServiceEffect(SqlClient.SqlClient, testSqlClient)
          )
        )
      );
    });
  });
}
