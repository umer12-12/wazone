import Stripe from 'stripe';

import { OFFICIAL_URL } from '@/const/url';
import { stripeEnv } from '@/envs/stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!stripeEnv.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(stripeEnv.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia', // Use latest stable
    });
  }

  /**
   * Create a Stripe Checkout Session for subscription
   */
  async createCheckoutSession(userId: string, userEmail: string, priceId: string, trialDays?: number) {
    const session = await this.stripe.checkout.sessions.create({
      cancel_url: `${OFFICIAL_URL}/settings/billing?status=cancelled`,
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      mode: 'subscription',
      subscription_data: trialDays ? {
        trial_period_days: trialDays,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      } : undefined,
      payment_method_collection: trialDays ? 'always' : 'if_required', // Force card even for $0 trial
      success_url: `${OFFICIAL_URL}/settings/billing?status=success&session_id={CHECKOUT_SESSION_ID}`,
    });

    return session;
  }

  /**
   * Create a Customer Portal Session for managing subscriptions
   */
  async createPortalSession(customerId: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${OFFICIAL_URL}/settings/billing`,
    });

    return session;
  }

  /**
   * Verify Webhook Signature
   */
  async verifyWebhook(body: string, sig: string) {
    if (!stripeEnv.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    return this.stripe.webhooks.constructEvent(
      body,
      sig,
      stripeEnv.STRIPE_WEBHOOK_SECRET
    );
  }
}
