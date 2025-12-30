import { z } from 'zod';
import { articles, categories, authors, conversations, conversationMessages, userAnalytics } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

const articleWithRelations = z.custom<typeof articles.$inferSelect & { 
  category: typeof categories.$inferSelect, 
  author: typeof authors.$inferSelect 
}>();

const messageWithContent = z.object({
  id: z.number(),
  conversationId: z.number(),
  role: z.string(),
  content: z.string(),
  createdAt: z.date().nullable(),
});

const conversationWithMessages = z.object({
  id: z.number(),
  sessionId: z.string(),
  title: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  messages: z.array(messageWithContent),
});

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          user: z.object({
            id: z.number(),
            username: z.string(),
            name: z.string(),
            role: z.string(),
          }),
          message: z.string(),
        }),
        401: errorSchemas.notFound,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.object({
          id: z.number(),
          username: z.string(),
          name: z.string(),
          role: z.string(),
        }),
        401: errorSchemas.notFound,
      },
    },
  },
  articles: {
    list: {
      method: 'GET' as const,
      path: '/api/articles',
      input: z.object({
        category: z.string().optional(),
        featured: z.enum(['true', 'false']).optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        writerId: z.number().optional(),
      }).optional(),
      responses: {
        200: z.array(articleWithRelations),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/articles/:slug',
      responses: {
        200: articleWithRelations,
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/articles',
      input: z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        content: z.string(),
        coverImage: z.string(),
        categoryId: z.number(),
        authorId: z.number(),
        readTime: z.number().optional(),
      }),
      responses: {
        201: z.object({ id: z.number(), message: z.string() }),
        400: errorSchemas.notFound,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/articles/:id/status',
      input: z.object({
        status: z.enum(['pending', 'approved', 'rejected']),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
      },
    },
    incrementClicks: {
      method: 'POST' as const,
      path: '/api/articles/:id/click',
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories',
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect>()),
      },
    },
  },
  authors: {
    list: {
      method: 'GET' as const,
      path: '/api/authors',
      responses: {
        200: z.array(z.custom<typeof authors.$inferSelect>()),
      },
    },
  },
  chat: {
    message: {
      method: 'POST' as const,
      path: '/api/chat',
      input: z.object({
        sessionId: z.string(),
        message: z.string(),
      }),
      responses: {
        200: z.object({
          conversationId: z.number(),
          messageId: z.number(),
          response: z.string(),
          suggestedArticles: z.array(articleWithRelations).optional(),
        }),
        400: errorSchemas.notFound,
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/chat/:sessionId',
      responses: {
        200: conversationWithMessages,
        404: errorSchemas.notFound,
      },
    },
  },
  analytics: {
    track: {
      method: 'POST' as const,
      path: '/api/analytics',
      input: z.object({
        sessionId: z.string(),
        event: z.string(),
        articleId: z.number().optional(),
        categoryId: z.number().optional(),
        metadata: z.record(z.any()).optional(),
      }),
      responses: {
        201: z.object({ success: z.boolean() }),
      },
    },
    adminDashboard: {
      method: 'GET' as const,
      path: '/api/admin/analytics',
      input: z.object({
        days: z.number().optional(),
      }).optional(),
      responses: {
        200: z.object({
          totalSessions: z.number(),
          totalEvents: z.number(),
          topArticles: z.array(z.object({
            id: z.number(),
            title: z.string(),
            views: z.number(),
          })),
          topCategories: z.array(z.object({
            id: z.number(),
            name: z.string(),
            views: z.number(),
          })),
          eventBreakdown: z.record(z.number()),
          chatEngagement: z.object({
            totalChats: z.number(),
            averageMessagesPerSession: z.number(),
          }),
          userBehavior: z.object({
            avgTimePerArticle: z.number(),
            scrollDepthAvg: z.number(),
            topSearchTerms: z.array(z.string()),
          }),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
