import { redirect } from 'next/navigation';

import { DEFAULT_VARIANTS, RouteVariants } from '@/utils/server/routeVariants';

export default function Page() {
  redirect(`/spa/${RouteVariants.serializeVariants(DEFAULT_VARIANTS)}`);
}
