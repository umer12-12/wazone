import type { ModelRuntimeHooks } from '@lobechat/model-runtime';
import { type LobeChatDatabase } from '@/database/type';
import { UsageLogModel } from '@/database/models/marketTool';
import { SystemConfigModel } from '@/database/models/systemConfig';

export function getBusinessModelRuntimeHooks(
  db: LobeChatDatabase,
  userId: string,
  _provider: string,
): ModelRuntimeHooks | undefined {
  return {
    beforeChatCompletion: async (payload) => {
      const systemConfigModel = new SystemConfigModel(db);
      const globalPrompt = await systemConfigModel.get('GLOBAL_SYSTEM_PROMPT');
      
      if (globalPrompt) {
        // Prepend Sultan's Global Identity to the message stream
        payload.messages = [
          { role: 'system', content: globalPrompt },
          ...payload.messages,
        ];
        console.log(`[Sultan Identity] Global Identity prompt injected.`);
      }
    },
    afterChatCompletion: async (payload) => {
      const { usage } = payload;
      if (!usage) return;

      const usageModel = new UsageLogModel(db);
      
      // Basic revenue calculation: (Total Tokens / 1000) * Sultan's Profit Margin (e.g., $0.02)
      const tokenCount = usage.totalTokens || 0;
      const profitMargin = 0.02; 
      const revenue = (tokenCount / 1000) * profitMargin;

      await usageModel.logUsage({
        userId,
        tokensUsed: tokenCount.toString(),
        revenue: revenue.toFixed(4),
        type: 'chat',
      });

      console.log(`[Sultan Analytics] User ${userId} used ${tokenCount} tokens. Revenue: $${revenue.toFixed(4)}`);
    },
  };
}
