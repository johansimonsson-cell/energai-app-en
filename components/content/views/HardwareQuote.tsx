'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import type { FlexProductId } from '@/lib/flex/catalog'

/**
 * "Hardware quote" no longer exists as a one-time amount in Energai Flex.
 * We convert old productSlugs to Flex IDs and redirect to flex-builder
 * (which shows monthly price per commitment period + any bundle discount).
 */
export function HardwareQuote({ data }: { data: Record<string, unknown> }) {
  const { setContentView } = useAppStore()

  useEffect(() => {
    const slugs = (data?.productSlugs as string[]) || []
    const selected: FlexProductId[] = []
    for (const s of slugs) {
      if (!s) continue
      if (s.includes('battery') || s.includes('batteri')) selected.push('battery')
      else if (s.includes('charger') || s.includes('laddstolpe') || s.includes('laddare')) selected.push('charger')
      else if (s.includes('plan') || s.includes('elavtal') || s.includes('electricity')) selected.push('electricity')
      else if (s.includes('sol') || s === 'solar') selected.push('solar')
    }
    const finalSelected = selected.length ? Array.from(new Set(selected)) : (['solar', 'battery'] as FlexProductId[])
    const binding = Object.fromEntries(finalSelected.filter((id) => id !== 'electricity').map((id) => [id, 10]))
    setContentView('flex-builder', { selected: finalSelected, binding })
  }, [data, setContentView])

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>Building your Flex package...</h2>
      <p style={{ color: 'var(--color-gray-700)' }}>
        We no longer show one-time amounts for hardware. In Energai Flex, hardware is amortised as
        a monthly cost. Opening the package builder...
      </p>
    </section>
  )
}
