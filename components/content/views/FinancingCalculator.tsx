'use client'

import { BindingExplainerView } from './flex/BindingExplainerView'

/**
 * Former external financing calculator. In Energai Flex there is no separate financing —
 * the commitment period IS the financing. We show the binding explainer.
 * Source: requirements 2026-04 section 1
 */
export function FinancingCalculator({ data }: { data: Record<string, unknown> }) {
  return <BindingExplainerView data={{ productId: data?.productId ?? 'solar' }} />
}
