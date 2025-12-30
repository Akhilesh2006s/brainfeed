// MySQL Database Connection with Automatic Database & Table Creation
// Converted from PostgreSQL to MySQL - All setup is done programmatically

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// Database connection parameters from environment variables
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "3306");
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "brainfeed";

// Connection pool (will be initialized after database setup)
let pool: mysql.Pool;
let db: any; // Type set to any for MySQL2 compatibility

/**
 * Initialize MySQL database and tables programmatically
 * This function:
 * 1. Creates the database if it doesn't exist
 * 2. Creates all required tables with proper schemas
 * 3. Sets up foreign keys and indexes
 */
async function initializeDatabase() {
  console.log("🔧 Initializing MySQL database...");

  // Step 1: Connect WITHOUT specifying database to create it if needed
  const tempConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  try {
    // Step 2: Create database if it doesn't exist
    console.log(`📦 Creating database '${DB_NAME}' if not exists...`);
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready`);

    // Step 3: Switch to the database
    await tempConnection.query(`USE \`${DB_NAME}\``);

    // Step 4: Create all tables programmatically
    console.log("📋 Creating tables if they don't exist...");

    // Users Table
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'users' ready");

    // Categories Table
    // Note: Using VARCHAR for fields with unique indexes (MySQL doesn't support TEXT in unique keys without length)
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'categories' ready");

    // Authors Table
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar TEXT NOT NULL,
        role VARCHAR(100) NOT NULL,
        bio TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'authors' ready");

    // Articles Table with Foreign Keys
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        cover_image TEXT NOT NULL,
        category_id INT NOT NULL,
        author_id INT NOT NULL,
        writer_id INT,
        is_featured BOOLEAN DEFAULT FALSE,
        read_time INT DEFAULT 5,
        status VARCHAR(50) DEFAULT 'pending',
        clicks INT DEFAULT 0,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category_id (category_id),
        INDEX idx_author_id (author_id),
        INDEX idx_writer_id (writer_id),
        INDEX idx_status (status),
        CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        CONSTRAINT fk_articles_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
        CONSTRAINT fk_articles_writer FOREIGN KEY (writer_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'articles' ready");

    // Conversations Table
    // Note: MySQL doesn't allow TEXT columns to have default values, using VARCHAR
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) DEFAULT 'New Conversation',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'conversations' ready");

    // Conversation Messages Table with Foreign Key
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_conversation_id (conversation_id),
        CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'conversation_messages' ready");

    // User Analytics Table with Foreign Keys
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS user_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        article_id INT,
        category_id INT,
        event VARCHAR(100) NOT NULL,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_id (session_id),
        INDEX idx_article_id (article_id),
        INDEX idx_category_id (category_id),
        INDEX idx_event (event),
        CONSTRAINT fk_analytics_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        CONSTRAINT fk_analytics_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'user_analytics' ready");

    console.log("🎉 All tables created successfully!");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  } finally {
    await tempConnection.end();
  }

  // Step 5: Create connection pool WITH database specified
  console.log("🔗 Creating connection pool...");
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

  // Step 6: Initialize Drizzle ORM with the pool
  db = drizzle(pool, { schema, mode: "default" });
  console.log("✅ Database connection pool ready");
  console.log("✅ Drizzle ORM initialized");
}

// Initialize on module load
await initializeDatabase();

// Export the connection pool and Drizzle instance
export { pool, db };
