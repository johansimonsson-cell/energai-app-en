'use client'

import { useAppStore } from '@/lib/store'

/**
 * Offer view — adapted for Energai Flex.
 * No percentage discounts on fixed/variable price. The only "offer" available
 * is the bundle discount on the fixed part when you add more products.
 * Source: requirements 2026-04 section 1
 */
export function OfferView({ data: _data }: { data: Record<string, unknown> }) {
  const { setContentView } = useAppStore()

  return (
    <section
      style={{
        background: 'var(--color-black)',
        color: 'var(--color-white)',
        padding: 'var(--space-12) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        height: '100%',
      }}
    >
      <span
        style={{
          fontSize: 'var(--type-label-md)',
          color: 'var(--color-gray-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Energai Flex — bundle discount
      </span>
      <h2 style={{ fontSize: 'var(--type-display-md)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--color-accent)' }}>
        More ecosystem,
        <br />
        lower monthly cost.
      </h2>
      <p style={{ color: 'var(--color-gray-300)', maxWidth: 580, margin: 0 }}>
        We have no temporary percentage discounts or hidden campaigns. The only discount you can get
        is the bundle discount on the fixed part — and it is permanent as long as your package is active.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 480 }}>
        <Row label="Solar + battery" pct={10} />
        <Row label="Solar + battery + charger" pct={15} />
        <Row label="Solar + battery + charger + electricity" pct={20} />
      </ul>

      <button
        onClick={() => setContentView('flex-builder', {})}
        style={{
          alignSelf: 'flex-start',
          padding: 'var(--space-4) var(--space-6)',
          background: 'var(--color-accent)',
          color: 'var(--color-black)',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
          fontFamily: 'var(--font-primary)',
        }}
      >
        Build your package →
      </button>
    </section>
  )
}

function Row({ label, pct }: { label: string; pct: number }) {
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-gray-800)', padding: 'var(--space-2) 0' }}>
      <span>{label}</span>
      <span style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: 'var(--color-accent)' }}>−{pct} %</span>
    </li>
  )
}
