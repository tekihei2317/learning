import { Data, Effect, Scope } from "effect";
import { SqlClient } from "@effect/sql";
import { SqliteClient } from "@effect/sql-sqlite-node";
import { Reactivity } from "@effect/experimental";
import * as fs from "node:fs/promises";

class RecordNotFoundError extends Data.TaggedError("RecordNotFoundError")<{}> {}

const getUserById = (userId: number) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    const users =
      yield* sql`select id, username, bio, profileImageUrl as image from User where id = ${userId}`;
    const user = users[0];

    if (user === undefined) {
      yield* new RecordNotFoundError();
    }
    return user;
  });

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
        // データベースに登録する
        const sql = yield* SqlClient.SqlClient;
        const results = yield* sql<{
          id: number;
        }>`insert into User (username, bio, profileImageUrl)
          values ('testuser', 'I am testuser', 'http://example.com/testuser.png')
          returning id`;
        const user = results[0] as { id: number };

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
}
