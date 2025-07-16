import { Effect, Option, Schema } from "effect";
import { SqlClient, SqlResolver, SqlSchema } from "@effect/sql";
import { RecordNotFoundError, User } from "./user";

export const getUserById = (userId: number) =>
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

export const getUserByIdResolver = (userId: number) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    const GetById = yield* SqlResolver.findById("GetUserById", {
      Id: Schema.Number,
      Result: User,
      ResultId: (_) => _.id,
      execute: (ids) =>
        sql`select id, username, bio, profileImageUrl as image from user where ${sql.in(
          ids
        )}`,
    });

    const result = yield* GetById.execute(userId);
    const user = yield* Option.match(result, {
      onNone: () => new RecordNotFoundError(),
      onSome: (user) => Effect.succeed(user),
    });

    return user;
  });

export const getUserByIdResolverExecute = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const GetById = yield* SqlResolver.findById("GetUserById", {
    Id: Schema.Number,
    Result: User,
    ResultId: (_) => _.id,
    execute: (ids) => {
      console.log({ ids });
      return sql`select id, username, bio, profileImageUrl as image from user where ${sql.in(
        "id",
        ids
      )}`;
    },
  });

  const execute = GetById.execute;
  return { execute };
});

export const getUserByIdSchema = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const GetById = SqlSchema.findOne({
    Request: Schema.Number,
    Result: User,
    execute: (id) =>
      sql`select id, username, bio, profileImageUrl as image from user where id = ${id}`,
  });

  return GetById;
});
