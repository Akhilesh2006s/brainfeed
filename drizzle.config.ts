import { defineConfig } from "drizzle-kit";

// MySQL configuration now uses individual connection parameters
// Format: mysql://user:password@host:port/database
// Or use individual DB_* environment variables

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "brainfeed",
  },
});
