import { Data, Schema } from "effect";

export class RecordNotFoundError extends Data.TaggedError(
  "RecordNotFoundError"
)<{}> {}

export class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  username: Schema.String,
  bio: Schema.String,
  image: Schema.String,
}) {}
