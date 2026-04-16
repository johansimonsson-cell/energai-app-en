'use client'

import { PlansOverview } from './PlansOverview'

/**
 * Former plan detail. There is only one Flex electricity plan — we show the same view as the overview.
 * Source: requirements 2026-04 section 1
 */
export function PlanDetail({ data }: { data: Record<string, unknown> }) {
  return <PlansOverview data={data} />
}
