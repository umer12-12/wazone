import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getServerDB } from '@/database/core/db-adaptor';
import { stripeEnv } from '@/envs/stripe';
import { StripeService } from '@/server/services/stripe';
import { SubscriptionService } from '@/server/services/subscription';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature') as string;

  const stripeService = new StripeService();
  let event: Stripe.Event;

  try {
    event = await stripeService.verifyWebhook(body, sig);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const db = await getServerDB();
  const subscriptionService = new SubscriptionService(db);

  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      
      if (userId) {
        // Map Price ID to Plan (you can refine this logic)
        const plan = 'premium'; // Default to premium for now, or fetch from session
        
        await subscriptionService.updateSubscription(userId, {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          plan,
        });
        
        console.log(`User ${userId} upgraded to ${plan} via Stripe.`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      // Find user by customerId and reset plan
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.stripeCustomerId, customerId),
      });

      if (user) {
        await subscriptionService.updateSubscription(user.id, {
          plan: 'hobby', // Reset to base plan
        });
        console.log(`User ${user.id} subscription deleted.`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
