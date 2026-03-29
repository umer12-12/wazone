import { type LobeChatDatabase } from '@lobechat/database';
import { eq } from 'drizzle-orm';

import { users } from '@/database/schemas';
import { StripeService } from '@/server/services/stripe';

export class SubscriptionService {
  private db: LobeChatDatabase;
  private stripe: StripeService;

  constructor(db: LobeChatDatabase) {
    this.db = db;
    this.stripe = new StripeService();
  }

  /**
   * Get User Subscription Status
   */
  async getSubscription(userId: string) {
    return this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  /**
   * Update User Subscription (Triggered by Webhook)
   */
  async updateSubscription(userId: string, data: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    plan?: string;
  }) {
    return this.db.update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}
