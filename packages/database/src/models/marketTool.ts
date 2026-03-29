import { eq } from 'drizzle-orm';

import { type LobeChatDatabase } from '../type';
import { marketTools, usageLogs } from '../schemas';

export class MarketToolModel {
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase) {
    this.db = db;
  }

  async getActiveTools() {
    return this.db.query.marketTools.findMany({
      where: (tools, { eq }) => eq(tools.active, true),
    });
  }

  async createTool(data: typeof marketTools.$inferInsert) {
    return this.db.insert(marketTools).values(data).returning();
  }

  async updateTool(id: string, data: Partial<typeof marketTools.$inferInsert>) {
    return this.db.update(marketTools).set(data).where(eq(marketTools.id, id)).returning();
  }

  async deleteTool(id: string) {
    return this.db.delete(marketTools).where(eq(marketTools.id, id)).returning();
  }
}

export class UsageLogModel {
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase) {
    this.db = db;
  }

  async logUsage(data: typeof usageLogs.$inferInsert) {
    return this.db.insert(usageLogs).values(data).returning();
  }

  async getRevenueStats() {
    // Basic aggregation for Sultan's dashboard
    const logs = await this.db.query.usageLogs.findMany();
    const totalRevenue = logs.reduce((acc, log) => acc + parseFloat(log.revenue || '0'), 0);
    const totalTokens = logs.reduce((acc, log) => acc + parseInt(log.tokensUsed || '0'), 0);
    
    return {
      totalRevenue,
      totalTokens,
      logCount: logs.length
    };
  }
}
