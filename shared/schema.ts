// MySQL schema - converted from PostgreSQL
// Note: Using varchar for fields with unique indexes or default values (MySQL limitation)
import { mysqlTable, text, varchar, int, timestamp, boolean, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for authentication
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Will store hashed password
  role: varchar("role", { length: 50 }).notNull(), // "admin" or "writer"
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const authors = mysqlTable("authors", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: text("avatar").notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  bio: text("bio"),
});

export const articles = mysqlTable("articles", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  categoryId: int("category_id").references(() => categories.id).notNull(),
  authorId: int("author_id").references(() => authors.id).notNull(),
  writerId: int("writer_id").references(() => users.id), // Reference to the writer who created it
  isFeatured: boolean("is_featured").default(false),
  readTime: int("read_time").default(5),
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "approved", "rejected"
  clicks: int("clicks").default(0), // Track number of clicks/views
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
}));

// Chat & Conversations
export const conversations = mysqlTable("conversations", {
  id: int("id").primaryKey().autoincrement(),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).default("New Conversation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversationMessages = mysqlTable("conversation_messages", {
  id: int("id").primaryKey().autoincrement(),
  conversationId: int("conversation_id").references(() => conversations.id).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversationRelations = relations(conversations, ({ many }) => ({
  messages: many(conversationMessages),
}));

export const messageRelations = relations(conversationMessages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationMessages.conversationId],
    references: [conversations.id],
  }),
}));

// User Analytics
export const userAnalytics = mysqlTable("user_analytics", {
  id: int("id").primaryKey().autoincrement(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  articleId: int("article_id").references(() => articles.id),
  categoryId: int("category_id").references(() => categories.id),
  event: varchar("event", { length: 100 }).notNull(), // "view", "read", "click", "search", "chat"
  metadata: json("metadata"), // Store additional data like scroll depth, time spent, etc. (changed from jsonb to json for MySQL)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertAuthorSchema = createInsertSchema(authors).omit({ id: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, publishedAt: true, createdAt: true, clicks: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(conversationMessages).omit({ id: true, createdAt: true });
export const insertAnalyticsSchema = createInsertSchema(userAnalytics).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Author = typeof authors.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type ConversationMessage = typeof conversationMessages.$inferSelect;
export type UserAnalytic = typeof userAnalytics.$inferSelect;
