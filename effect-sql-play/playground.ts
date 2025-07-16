import { Effect } from "effect";
import { SqlClient, SqlResolver } from "@effect/sql";
import { SqliteClient } from "@effect/sql-sqlite-node";
import { Reactivity } from "@effect/experimental";
import * as fs from "node:fs/promises";
import { getUserById, getUserByIdResolver } from "./resolver-get-user-by-id";
import { insertUserResolver } from "./resolver-insert-user";

const sqlClient = SqliteClient.make({
  filename: ":memory:",
});

const testSqlClient = Effect.gen(function* () {
  const sql = yield* sqlClient;

  const schemaSql = yield* Effect.promise(() =>
    fs.readFile("./schema.sql", { encoding: "utf-8" })
  );

  const statements = schemaSql.split(";").map((statement) => statement.trim());
  for (const statement of statements) {
    if (statement !== "") {
      yield* sql.unsafe(statement);
    }
  }

  return sql;
}).pipe(Effect.provide(Reactivity.layer));

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
  });
}
