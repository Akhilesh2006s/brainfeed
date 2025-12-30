// Storage utility for Next.js API routes
import { db } from "./db";
import { articles, categories, authors, type Article, type Category, type Author } from "@shared/schema";
import { eq, desc, like, and } from "drizzle-orm";

export class DatabaseStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getAuthors(): Promise<Author[]> {
    return await db.select().from(authors);
  }

  async getArticles(filters?: { category?: string; featured?: boolean; search?: string; status?: string; writerId?: number }): Promise<(Article & { category: Category; author: Author })[]> {
    const conditions = [];

    if (filters?.category) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.slug, filters.category),
      });
      if (category) {
        conditions.push(eq(articles.categoryId, category.id));
      } else {
        return []; // Category not found
      }
    }

    if (filters?.featured !== undefined) {
      conditions.push(eq(articles.isFeatured, filters.featured));
    }

    if (filters?.search) {
      conditions.push(like(articles.title, `%${filters.search}%`));
    }

    if (filters?.status) {
      conditions.push(eq(articles.status, filters.status));
    }

    if (filters?.writerId) {
      conditions.push(eq(articles.writerId, filters.writerId));
    }

    return await db.query.articles.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        category: true,
        author: true,
      },
      orderBy: [desc(articles.publishedAt)],
    });
  }

  async getArticleBySlug(slug: string): Promise<(Article & { category: Category; author: Author }) | undefined> {
    return await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
      with: {
        category: true,
        author: true,
      },
    });
  }
}

export const storage = new DatabaseStorage();

