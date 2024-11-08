// import type { Config } from "drizzle-kit";
// import { defineConfig } from "drizzle-kit"
// import * as dotenv from "dotenv";
// dotenv.config({ path: ".env" });

// export default {
//   driver: 'postgressql',
//   schema: './src/lib/db/schema.ts',
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   }

// } satisfies Config

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

/* const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
} */

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: 'vultr-prod-c3f1adc5-26f5-4b7a-8f0f-a8c1443838a7-vultr-prod-fdc0.vultrdb.com',
    database: 'defaultdb',
    user: 'vultradmin',
    password: 'AVNS_kmViubNaac7r3rT0yMU',
    port: 16751,
  },
});