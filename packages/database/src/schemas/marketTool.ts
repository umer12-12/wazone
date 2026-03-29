import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const marketToolTypeEnum = pgEnum('market_tool_type', ['plugin', 'agent', 'custom']);

export const marketTools = pgTable('market_tools', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  identifier: text('identifier').notNull().unique(), // e.g., 'wazone-whatsapp'
  manifestUrl: text('manifest_url').notNull(),
  label: text('label').notNull(),
  prompt: text('prompt'), // Custom system prompt for this tool
  isSultanTool: boolean('is_sultan_tool').default(true),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usageLogs = pgTable('usage_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull(),
  tokensUsed: text('tokens_used').default('0'),
  cost: text('cost').default('0'),
  revenue: text('revenue').default('0'),
  type: text('type').default('chat'), // chat, tool, plugin
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});
