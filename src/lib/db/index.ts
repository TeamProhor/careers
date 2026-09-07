import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const rawConnectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL || "";

const connectionString = rawConnectionString
  .replace(/[?&]pgbouncer=[^&]+/gi, "")
  .replace(/\?&/g, "?")
  .replace(/\?$/, "");

const client = postgres(connectionString, {
  prepare: false,
  max: 10,
});

export const db = drizzle(client, { schema });
