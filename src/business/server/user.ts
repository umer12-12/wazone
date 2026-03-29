import { Plans, type ReferralStatusString } from '@lobechat/types';
import { eq } from 'drizzle-orm';
import dayjs from 'dayjs';

import { getServerDB } from '@/database/core/db-adaptor';
import { users } from '@/database/schemas';

export async function getReferralStatus(userId: string): Promise<ReferralStatusString | undefined> {
  return undefined;
}

export async function getSubscriptionPlan(userId: string): Promise<Plans> {
  const db = await getServerDB();
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // If user is in trial, return Premium (Pro)
  if (user?.trialEndsAt && dayjs().isBefore(user.trialEndsAt)) {
    return Plans.Premium;
  }

  // Fallback to Hobby or prompt for upgrade (Free is removed)
  return Plans.Hobby;
}

export async function initNewUserForBusiness(
  userId: string,
  createdAt: Date | null | undefined,
): Promise<void> {
  const db = await getServerDB();
  
  // Set 7-day trial for new users
  const trialStartedAt = new Date();
  const trialEndsAt = dayjs().add(7, 'days').toDate();

  await db.update(users)
    .set({
      trialStartedAt,
      trialEndsAt,
    })
    .where(eq(users.id, userId));
}
