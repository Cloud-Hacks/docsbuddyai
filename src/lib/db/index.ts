import { drizzle } from "drizzle-orm/postgres-js"; // Use postgres-js adapter for postgres library

const postgres = require('postgres');


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
