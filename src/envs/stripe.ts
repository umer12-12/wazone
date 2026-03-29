import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const stripeEnv = createEnv({
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID_STARTER: process.env.STRIPE_PRICE_ID_STARTER,
    STRIPE_PRICE_ID_PREMIUM: process.env.STRIPE_PRICE_ID_PREMIUM,
    STRIPE_PRICE_ID_ULTIMATE: process.env.STRIPE_PRICE_ID_ULTIMATE,
  },
  server: {
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    
    // Price IDs for Wazone Plans
    STRIPE_PRICE_ID_STARTER: z.string().optional(),
    STRIPE_PRICE_ID_PREMIUM: z.string().optional(),
    STRIPE_PRICE_ID_ULTIMATE: z.string().optional(),
  },
});
