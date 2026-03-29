import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { MarketToolModel, UsageLogModel } from '@/database/models/marketTool';
import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';

const sultanMarketProcedure = authedProcedure.use(serverDatabase).use(async ({ ctx, next }) => {
  // Check if Sultan Umer is the one acting (Optional, but good for branding)
  return next({
    ctx: {
      marketModel: new MarketToolModel(ctx.serverDB),
    },
  });
});

export const sultanMarketRouter = router({
  getTools: sultanMarketProcedure.query(async ({ ctx }) => {
    return ctx.marketModel.getActiveTools();
  }),

  addTool: sultanMarketProcedure
    .input(
      z.object({
        identifier: z.string(),
        manifestUrl: z.string().url(),
        label: z.string(),
        prompt: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.marketModel.createTool({
          ...input,
          isSultanTool: true,
          active: true,
        });
      } catch (error: any) {
        console.error('[SultanMarket] Error adding tool:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add Sultan tool',
        });
      }
    }),

  removeTool: sultanMarketProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.marketModel.deleteTool(input.id);
    }),

  toggleTool: sultanMarketProcedure
    .input(z.object({ id: z.string(), active: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.marketModel.updateTool(input.id, { active: input.active });
    }),

  getAnalytics: sultanMarketProcedure.query(async ({ ctx }) => {
    const usageModel = new UsageLogModel(ctx.serverDB);
    return usageModel.getRevenueStats();
  }),
});
