'use client'

import { useAppStore } from '@/lib/store'
import { getFlexProduct } from '@/lib/flex/catalog'
import { NetworkFeeToggle } from './flex/NetworkFeeToggle'

/**
 * Former "PlansOverview" — now Energai Flex electricity contract.
 * Only one plan: spot price + 10 öre/kWh, no lock-in. Source: requirements 2026-04 section 1.
 */
export function PlansOverview({ data: _data }: { data: Record<string, unknown> }) {
  const { setContentView } = useAppStore()
  const elavtal = getFlexProduct('electricity')

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxWidth: 760 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-label-md)',
            color: 'var(--color-gray-600)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Energai Flex — electricity contract
        </span>
        <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
          One electricity contract. No lock-in. Nothing hidden.
        </h2>
        <p style={{ color: 'var(--color-gray-700)', margin: 0, fontSize: 'var(--type-body-md)' }}>
          We only have one electricity pricing plan: spot price + 10 öre/kWh + a small fixed monthly
          fee. That is our margin — full transparency.
        </p>
      </header>

      <article
        style={{
          padding: 'var(--space-8)',
          background: 'var(--color-black)',
          color: 'var(--color-white)',
          borderLeft: '3px solid var(--color-accent)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div>
            <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Fixed monthly fee
            </span>
            <div style={{ fontSize: 'var(--type-display-md)', fontWeight: 700, lineHeight: 1, color: 'var(--color-accent)' }}>
              {elavtal.fixedMonthlyFee} <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-300)' }}>kr/mo</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Markup on spot price
            </span>
            <div style={{ fontSize: 'var(--type-display-md)', fontWeight: 700, lineHeight: 1, color: 'var(--color-accent)' }}>
              +10 <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-300)' }}>öre/kWh</span>
            </div>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <li>• No lock-in period on the electricity contract</li>
          <li>• 100% renewable electricity (RECS/EECS)</li>
          <li>• Billed monthly based on actual consumption</li>
          <li>• Activation within 1–2 days (new sign-up), 2–3 weeks (switch)</li>
        </ul>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setContentView('signup-form', { flex: { selected: ['electricity'], binding: {} } })}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'var(--color-accent)',
              color: 'var(--color-black)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontFamily: 'var(--font-primary)',
            }}
          >
            Sign up for electricity →
          </button>
          <button
            onClick={() => setContentView('flex-builder', { selected: ['electricity'], binding: {} })}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'transparent',
              color: 'var(--color-white)',
              border: '1px solid var(--color-gray-700)',
              cursor: 'pointer',
              fontFamily: 'var(--font-primary)',
            }}
          >
            Add hardware
          </button>
        </div>
      </article>

      <NetworkFeeToggle />

      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--type-body-sm)', margin: 0 }}>
        The network fee is paid to your grid operator — not to us. The toggle above shows price incl/excl.
      </p>
    </section>
  )
}
