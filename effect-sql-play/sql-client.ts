import { SqliteClient } from "@effect/sql-sqlite-node";
import { Effect } from "effect";
import { Reactivity } from "@effect/experimental";
import * as fs from "node:fs/promises";

const sqlClient = SqliteClient.make({
  filename: ":memory:",
});

export const testSqlClient = Effect.gen(function* () {
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
