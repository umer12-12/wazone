import { eq } from 'drizzle-orm';

import { systemConfigs } from '../schemas';
import type { LobeChatDatabase } from '../type';

export class SystemConfigModel {
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase) {
    this.db = db;
  }

  /**
   * Upsert a configuration value
   */
  set = async (key: string, value: string, group?: string, description?: string) => {
    return this.db
      .insert(systemConfigs)
      .values({
        description,
        group,
        key,
        value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        set: { description, group, value, updatedAt: new Date() },
        target: systemConfigs.key,
      })
      .returning();
  };

  /**
   * Get all configurations
   */
  all = async () => {
    return this.db.query.systemConfigs.findMany();
  };

  /**
   * Get a specific configuration value
   */
  get = async (key: string) => {
    const result = await this.db.query.systemConfigs.findFirst({
      where: eq(systemConfigs.key, key),
    });
    return result?.value;
  };
}
