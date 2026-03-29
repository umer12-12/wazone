import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import { SystemConfigService } from '@/server/services/systemConfig';

const adminProcedure = authedProcedure.use(serverDatabase).use(async (opts) => {
  const { ctx } = opts;
  
  // Strict Sultan check for Admin Operations
  if (ctx.userId !== 'umarfarooqpny@gmail.com' && ctx.user?.email !== 'umarfarooqpny@gmail.com') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only the Sultan can access this command center.',
    });
  }

  return opts.next({
    ctx: {
      systemConfigService: new SystemConfigService(ctx.serverDB),
    },
  });
});

export const systemConfigRouter = router({
  getSettings: adminProcedure.query(async ({ ctx }) => {
    return await ctx.systemConfigService.getSettings();
  }),

  updateSetting: adminProcedure
    .input(
      z.object({
        description: z.string().optional(),
        group: z.string().optional(),
        key: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.systemConfigService.updateSetting(
        input.key,
        input.value,
        input.group,
        input.description,
      );
    }),

  /**
   * List all system users (Sultan Only)
   */
  listUsers: adminProcedure.query(async ({ ctx }) => {
    const { UserModel } = await import('@/database/models/user');
    return await UserModel.list(ctx.serverDB);
  }),

  /**
   * Update a specific user trial/plan (Sultan Only)
   */
  updateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
        trialEndsAt: z.date().optional(),
        banned: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { UserModel } = await import('@/database/models/user');
      const { id, ...value } = input;
      return await UserModel.updateById(ctx.serverDB, id, value);
    }),
});
