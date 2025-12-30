import { db } from "./db";
import { articles, categories, authors, users, type Article, type Category, type Author, type User } from "@shared/schema";
import { eq, desc, like, and } from "drizzle-orm";

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getAuthors(): Promise<Author[]>;
  getArticles(filters?: { category?: string; featured?: boolean; search?: string; status?: string; writerId?: number }): Promise<(Article & { category: Category; author: Author })[]>;
  getArticleBySlug(slug: string): Promise<(Article & { category: Category; author: Author }) | undefined>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
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

  async seedData(): Promise<void> {
    const existingCats = await this.getCategories();
    if (existingCats.length > 0) return;

    // Seed Users (hardcoded logins)
    // Using simple password hashing with bcrypt
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("password123", 10); // Default password for all users
    
    await db.insert(users).values([
      { username: "admin", password: hashedPassword, role: "admin", name: "Admin User" },
      { username: "writer1", password: hashedPassword, role: "writer", name: "Writer One" },
      { username: "writer2", password: hashedPassword, role: "writer", name: "Writer Two" },
      { username: "writer3", password: hashedPassword, role: "writer", name: "Writer Three" },
      { username: "writer4", password: hashedPassword, role: "writer", name: "Writer Four" },
    ]);

    // Seed Categories
    // Note: MySQL doesn't support .returning() - insert then query back
    await db.insert(categories).values([
      { name: "Science & STEM", slug: "science-stem", description: "Biology, Physics, Chemistry, Engineering" },
      { name: "Tech & AI", slug: "tech-ai", description: "Artificial Intelligence, Coding, Cybersecurity" },
      { name: "Careers & Skills", slug: "careers-skills", description: "Job Market, Internships, Certifications" },
      { name: "Student Stories", slug: "student-stories", description: "Success stories, interviews" },
      { name: "AI Insights", slug: "ai-insights", description: "Daily AI news and trends" },
      { name: "Community", slug: "community", description: "Forums, discussions, events" },
    ]);

    // Query back the inserted categories
    const cats = await this.getCategories();

    // Seed Authors
    await db.insert(authors).values([
      { name: "Dr. Sarah Chen", role: "Science Editor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", bio: "Ph.D. in Astrophysics, passionate about STEM education." },
      { name: "Marcus Johnson", role: "Tech Reporter", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", bio: "Former software engineer turned tech journalist." },
      { name: "Priya Patel", role: "Education Specialist", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", bio: "Focuses on innovative learning methodologies." },
    ]);

    // Query back the inserted authors
    const authorsList = await this.getAuthors();

    // Seed Articles
    await db.insert(articles).values([
      {
        title: "The Future of AI in Classrooms: Friend or Foe?",
        slug: "future-of-ai-in-classrooms",
        excerpt: "Exploring how artificial intelligence is reshaping the educational landscape and personalized learning.",
        content: "Artificial Intelligence is no longer just a buzzword; it's becoming a staple in modern education...",
        coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
        categoryId: cats.find(c => c.slug === 'tech-ai')!.id,
        authorId: authorsList[0].id,
        isFeatured: true,
        readTime: 6,
      },
      {
        title: "Top 10 Emerging STEM Careers for 2026",
        slug: "top-stem-careers-2026",
        excerpt: "A comprehensive guide to the most in-demand jobs in science, technology, engineering, and math.",
        content: "As technology evolves, so does the job market. Here are the top careers you should be preparing for...",
        coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000",
        categoryId: cats.find(c => c.slug === 'careers-skills')!.id,
        authorId: authorsList[1].id,
        isFeatured: true,
        readTime: 8,
      },
      {
        title: "Student Spotlight: Building a Solar Car at 16",
        slug: "student-spotlight-solar-car",
        excerpt: "Meet the high school team that designed and built a fully functional solar-powered vehicle.",
        content: "In a small garage in Mumbai, a group of dedicated students proved that innovation knows no age...",
        coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
        categoryId: cats.find(c => c.slug === 'student-stories')!.id,
        authorId: authorsList[2].id,
        isFeatured: false,
        readTime: 5,
      },
      {
        title: "Understanding Quantum Computing Basics",
        slug: "understanding-quantum-computing",
        excerpt: "A beginner-friendly introduction to the complex world of quantum mechanics and computing.",
        content: "Quantum computing operates on principles that defy our classical understanding of physics...",
        coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
        categoryId: cats.find(c => c.slug === 'science-stem')!.id,
        authorId: authorsList[0].id,
        isFeatured: false,
        readTime: 10,
      },
      {
        title: "Cybersecurity Tips for Students",
        slug: "cybersecurity-tips-students",
        excerpt: "Essential practices to keep your digital life secure in an increasingly connected world.",
        content: "With more of our lives moving online, digital hygiene is more important than ever...",
        coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
        categoryId: cats.find(c => c.slug === 'tech-ai')!.id,
        authorId: authorsList[1].id,
        isFeatured: false,
        readTime: 4,
      },
    ]);
  }
}

export const storage = new DatabaseStorage();
