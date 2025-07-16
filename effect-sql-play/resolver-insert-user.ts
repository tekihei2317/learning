import { SqlClient, SqlResolver } from "@effect/sql";
import { Effect, Schema } from "effect";
import { User } from "./user";

const InsertPersonSchema = Schema.Struct({
  username: Schema.String,
  bio: Schema.String,
  profileImageUrl: Schema.String,
});

export const insertUserResolver = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const InsertUser = yield* SqlResolver.ordered("InsertUser", {
    Request: InsertPersonSchema,
    Result: User,
    execute: (requests) =>
      sql`insert into User ${sql.insert(
        requests
      )} returning *, profileImageUrl as image`,
  });

  return { insert: InsertUser.execute };
});
