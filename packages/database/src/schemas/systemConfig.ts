import { pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from './_helpers';

export const systemConfigs = pgTable('system_configs', {
  key: text('key').primaryKey().notNull(),
  value: text('value').notNull(),
  description: text('description'),
  group: text('group'),

  ...timestamps,
});

export type NewSystemConfig = typeof systemConfigs.$inferInsert;
export type SystemConfigItem = typeof systemConfigs.$inferSelect;
