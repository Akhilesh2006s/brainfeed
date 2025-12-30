import { db } from "../../db";
import { conversations, conversationMessages } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IChatStorage {
  getConversation(id: number): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof conversations.$inferSelect)[]>;
  createConversation(title: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<(typeof conversationMessages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof conversationMessages.$inferSelect>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  },

  async getAllConversations() {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  },

  async createConversation(title: string) {
    // MySQL doesn't support .returning() - insert then query back
    const result = await db.insert(conversations).values({ title, sessionId: `session-${Date.now()}` }) as any;
    const insertedId = Number(result.insertId);
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, insertedId),
    });
    return conversation!;
  },

  async deleteConversation(id: number) {
    await db.delete(conversationMessages).where(eq(conversationMessages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  },

  async getMessagesByConversation(conversationId: number) {
    return db.select().from(conversationMessages).where(eq(conversationMessages.conversationId, conversationId)).orderBy(conversationMessages.createdAt);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    // MySQL doesn't support .returning() - insert then get the ID
    const result = await db.insert(conversationMessages).values({ conversationId, role, content }) as any;
    const insertedId = Number(result.insertId);
    const message = await db.query.conversationMessages.findFirst({
      where: eq(conversationMessages.id, insertedId),
    });
    return message!;
  },
};

