import { defineConfig, type Config } from "drizzle-kit";
require("dotenv").config();

export default defineConfig({
  schema: "src/schema/index.ts",
  out: "drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env["DB_HOST"] as string,
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    port: +(process.env["DB_PORT"] as string),
    database: process.env["DB_DATABASE"] as string,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
