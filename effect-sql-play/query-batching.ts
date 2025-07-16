import { Effect } from "effect";
import { SqlClient } from "@effect/sql";
import { testSqlClient } from "./sql-client";
import { getUserByIdResolverExecute } from "./resolver-get-user-by-id";

const program = Effect.gen(function* () {
  const { user, user2 } = yield* Effect.all(
    {
      user: (yield* getUserByIdResolverExecute).execute(1),
      user2: (yield* getUserByIdResolverExecute).execute(2),
    },
    { batching: true }
  );
  console.log(user, user2);
});

Effect.runPromise(
  Effect.scoped(
    program.pipe(
      Effect.provideServiceEffect(SqlClient.SqlClient, testSqlClient)
    )
  )
);
