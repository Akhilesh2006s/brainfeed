// Database connection utility for Next.js API routes
// This is a serverless-compatible version of server/db.ts

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// Database connection parameters from environment variables
function parseDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    try {
      // Format: mysql://user:password@host:port/database
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port || "3306"),
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1).split('?')[0], // Remove leading / and query params
      };
    } catch {
      // Fallback to individual env vars if URL parsing fails
    }
  }
  return null;
}

const dbConfig = parseDatabaseUrl();
const DB_HOST = process.env.DB_HOST || dbConfig?.host || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || String(dbConfig?.port || 3306));
const DB_USER = process.env.DB_USER || dbConfig?.user || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || dbConfig?.password || "";
const DB_NAME = process.env.DB_NAME || dbConfig?.database || "brainfeed";

// Create a connection pool that works in serverless environments
let pool: mysql.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

function getDb() {
  if (!dbInstance) {
    const pool = getPool();
    dbInstance = drizzle(pool, { schema, mode: "default" });
  }
  return dbInstance;
}

export const db = getDb();
export { getPool };

