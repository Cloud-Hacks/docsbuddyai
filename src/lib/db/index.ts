import { drizzle } from "drizzle-orm/postgres-js"; // Use postgres-js adapter for postgres library

const postgres = require('postgres');

/* if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found");
} */

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 16751,
  ssl: 'require',
});

// Initialize drizzle with the postgres instance
export const db = drizzle(sql);
