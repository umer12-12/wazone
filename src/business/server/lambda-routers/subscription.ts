import { z } from 'zod';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import { StripeService } from '@/server/services/stripe';
import { stripeEnv } from '@/envs/stripe';

export const subscriptionRouter = router({
  /**
   * Create Checkout Session for a specific price
   */
  createCheckoutSession: authedProcedure
    .use(serverDatabase)
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { SystemConfigService } = await import('@/server/services/systemConfig');
      const stripeService = new StripeService();
      const configService = new SystemConfigService(ctx.serverDB);
      
      const settings = await configService.getSettings();
      
      // Determine if trial is enabled for this plan
      let trialDays: number | undefined = undefined;
      const isStarter = input.priceId === stripeEnv.STRIPE_PRICE_ID_STARTER;
      const isPremium = input.priceId === stripeEnv.STRIPE_PRICE_ID_PREMIUM;
      const isUltimate = input.priceId === stripeEnv.STRIPE_PRICE_ID_ULTIMATE;

      if ((isStarter && settings['PLAN_STARTER_TRIAL'] === 'true') ||
          (isPremium && settings['PLAN_PREMIUM_TRIAL'] === 'true') ||
          (isUltimate && settings['PLAN_ULTIMATE_TRIAL'] === 'true')) {
        trialDays = 7;
      }

      // Fetch user email
      const user = await ctx.serverDB.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
      });

      if (!user?.email) {
        throw new Error('User email not found for Stripe checkout');
      }

      const session = await stripeService.createCheckoutSession(
        ctx.userId,
        user.email,
        input.priceId,
        trialDays
      );

      return { url: session.url };
    }),

  /**
   * Create Billing Portal Session
   */
  createPortalSession: authedProcedure
    .use(serverDatabase)
    .mutation(async ({ ctx }) => {
      const stripeService = new StripeService();
      const user = await ctx.serverDB.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
      });

      if (!user?.stripeCustomerId) {
        throw new Error('Customer Portal not available: No Stripe account link found.');
      }

      const session = await stripeService.createPortalSession(user.stripeCustomerId);
      return { url: session.url };
    }),

  /**
   * Get Current Plan Metadata (Price IDs)
   */
  getPlanIds: authedProcedure.query(() => {
    return {
      starter: stripeEnv.STRIPE_PRICE_ID_STARTER,
      premium: stripeEnv.STRIPE_PRICE_ID_PREMIUM,
      ultimate: stripeEnv.STRIPE_PRICE_ID_ULTIMATE,
    };
  }),
});
