import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { db } from "./db";
import { conversationMessages, userAnalytics, conversations, users, articles, categories } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import OpenAI from "openai";
import bcrypt from "bcryptjs";
import { registerSitemapRoute } from "./sitemap";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Middleware to check if user is admin
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

// Middleware to check if user is writer or admin
const requireWriter = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || (req.session.role !== "writer" && req.session.role !== "admin")) {
    return res.status(403).json({ message: "Forbidden: Writer access required" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize seed data
  await storage.seedData();
  
  // Register SEO routes
  registerSitemapRoute(app);

  // === AUTHENTICATION ROUTES ===
  app.post(api.auth.login.path, async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
        message: "Login successful",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get(api.auth.me.path, requireAuth, async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.session.userId!),
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // === ARTICLE ROUTES ===
  app.get(api.articles.list.path, async (req, res) => {
    try {
      const filters: any = {
        category: req.query.category as string | undefined,
        featured: req.query.featured ? req.query.featured === 'true' : undefined,
        search: req.query.search as string | undefined,
      };

      // If status filter is provided (admin/writer only)
      if (req.query.status) {
        filters.status = req.query.status as string;
      } else {
        // Public users only see approved articles
        if (!req.session.userId) {
          filters.status = 'approved';
        }
      }

      // If writerId filter is provided (for writer's own articles)
      if (req.query.writerId) {
        filters.writerId = parseInt(req.query.writerId as string);
      }

      const articles = await storage.getArticles(filters);
      res.json(articles);
    } catch (error) {
      console.error("Get articles error:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get(api.articles.get.path, async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Public users can only see approved articles
      if (!req.session.userId && article.status !== 'approved') {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      console.error("Get article error:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Create article (writer only)
  app.post(api.articles.create.path, requireWriter, async (req, res) => {
    try {
      const { title, slug, excerpt, content, coverImage, categoryId, authorId, readTime } = req.body;

      const result = await db.insert(articles).values({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        authorId,
        writerId: req.session.userId,
        readTime: readTime || 5,
        status: 'pending',
      }) as any;

      res.status(201).json({
        id: Number(result.insertId),
        message: "Article created successfully. Waiting for admin approval.",
      });
    } catch (error) {
      console.error("Create article error:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  // Update article status (admin only)
  app.patch(api.articles.updateStatus.path, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await db.update(articles)
        .set({ status })
        .where(eq(articles.id, parseInt(id)));

      res.json({ message: `Article ${status} successfully` });
    } catch (error) {
      console.error("Update article status error:", error);
      res.status(500).json({ message: "Failed to update article status" });
    }
  });

  // Increment article clicks
  app.post(api.articles.incrementClicks.path, async (req, res) => {
    try {
      const { id } = req.params;

      await db.update(articles)
        .set({ clicks: sql`clicks + 1` })
        .where(eq(articles.id, parseInt(id)));

      res.json({ success: true });
    } catch (error) {
      console.error("Increment clicks error:", error);
      res.status(500).json({ success: false });
    }
  });

  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get(api.authors.list.path, async (req, res) => {
    const authors = await storage.getAuthors();
    res.json(authors);
  });

  // === CHAT ROUTES ===
  app.post(api.chat.message.path, async (req, res) => {
    const { sessionId, message } = req.body;
    
    try {
      // Get or create conversation
      let conversation = await db.query.conversations.findFirst({
        where: eq(conversations.sessionId, sessionId),
        with: { messages: true },
      });

      if (!conversation) {
        // MySQL doesn't support .returning() - insert then query back
        await db.insert(conversations).values({ sessionId });
        conversation = await db.query.conversations.findFirst({
          where: eq(conversations.sessionId, sessionId),
          with: { messages: true },
        }) as any;
        
        if (!conversation) {
          return res.status(500).json({ error: "Failed to create conversation" });
        }
      }

      // Save user message
      const userMsgResult = await db.insert(conversationMessages)
        .values({ conversationId: conversation!.id, role: "user", content: message }) as any;
      
      // Get the inserted message ID (MySQL uses insertId)
      const userMsgId = Number(userMsgResult.insertId);

      // Get conversation history for context
      const history = await db.select().from(conversationMessages)
        .where(eq(conversationMessages.conversationId, conversation!.id))
        .orderBy(conversationMessages.createdAt);

      const chatHistory = history.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Get AI response
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: chatHistory,
        max_completion_tokens: 1024,
      });

      const assistantContent = response.choices[0]?.message?.content || "I couldn't generate a response.";

      // Save assistant message
      await db.insert(conversationMessages)
        .values({ conversationId: conversation!.id, role: "assistant", content: assistantContent });

      // Get related articles based on the conversation
      const allArticles = await storage.getArticles();
      const suggestedArticles = allArticles.slice(0, 3);

      res.json({
        conversationId: conversation!.id,
        messageId: userMsgId,
        response: assistantContent,
        suggestedArticles,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  app.get(api.chat.history.path, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.sessionId, sessionId),
        with: { messages: { orderBy: desc(conversationMessages.createdAt) } },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // === ANALYTICS ROUTES ===
  app.post(api.analytics.track.path, async (req, res) => {
    const { sessionId, event, articleId, categoryId, metadata } = req.body;

    try {
      await db.insert(userAnalytics).values({
        sessionId,
        event,
        articleId: articleId || null,
        categoryId: categoryId || null,
        metadata,
      });

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  app.get(api.analytics.adminDashboard.path, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Get analytics summary
      const allAnalytics = await db.query.userAnalytics.findMany({
        where: sql`${userAnalytics.createdAt} > ${startDate}`,
      });

      const totalSessions = new Set(allAnalytics.map((a: any) => a.sessionId)).size;
      const totalEvents = allAnalytics.length;

      // Get top articles
      const topArticles = allAnalytics
        .filter((a: any) => a.articleId)
        .reduce((acc: any[], a: any) => {
          const existing = acc.find((x: any) => x.articleId === a.articleId);
          if (existing) existing.count++;
          else acc.push({ articleId: a.articleId, count: 1 });
          return acc;
        }, [] as any[])
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);

      const articles = await storage.getArticles();
      const topArticlesWithNames = topArticles.map((ta: any) => {
        const article = articles.find((a: any) => a.id === ta.articleId);
        return { id: ta.articleId, title: article?.title || "Unknown", views: ta.count };
      });

      // Get event breakdown
      const eventBreakdown = allAnalytics.reduce((acc: Record<string, number>, a: any) => {
        acc[a.event] = (acc[a.event] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Chat engagement
      const chatEvents = allAnalytics.filter((a: any) => a.event === "chat");
      const chatSessions = new Set(chatEvents.map((c: any) => c.sessionId)).size;
      const averageMessagesPerSession = chatSessions > 0 ? chatEvents.length / chatSessions : 0;

      // User behavior
      const scrollDepthData = allAnalytics
        .filter((a: any) => a.metadata && typeof a.metadata === 'object' && 'scrollDepth' in a.metadata)
        .map((a: any) => (a.metadata as any).scrollDepth as number);
      const scrollDepthAvg = scrollDepthData.length > 0 ? scrollDepthData.reduce((a: number, b: number) => a + b) / scrollDepthData.length : 0;

      res.json({
        totalSessions,
        totalEvents,
        topArticles: topArticlesWithNames,
        topCategories: [],
        eventBreakdown,
        chatEngagement: {
          totalChats: chatSessions,
          averageMessagesPerSession: Math.round(averageMessagesPerSession * 100) / 100,
        },
        userBehavior: {
          avgTimePerArticle: 0,
          scrollDepthAvg: Math.round(scrollDepthAvg),
          topSearchTerms: [],
        },
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  return httpServer;
}
