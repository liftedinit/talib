export const ARRAYBUFFER_FIELD_TYPE =
  process.env.DATABASE_TYPE == "postgres" ? "bytea" : "blob";
