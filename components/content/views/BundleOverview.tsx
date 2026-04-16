'use client'

import { useAppStore } from '@/lib/store'
import {
  FLEX_PRODUCTS,
  type FlexProductId,
  type BindingYears,
  calculateFlex,
} from '@/lib/flex/catalog'

/**
 * Former "BundleOverview" — now shown as Flex suggestions.
 * No static bundles anymore; everything comes from Energai Flex.
 * Source: requirements update 2026-04.md section 1
 */

interface Preset {
  id: string
  name: string
  blurb: string
  selected: FlexProductId[]
  binding: Partial<Record<FlexProductId, BindingYears>>
}

const PRESETS: Preset[] = [
  {
    id: 'sol-batt',
    name: 'Solar + battery',
    blurb: 'Produce and store your own energy. Take full advantage of price variance.',
    selected: ['solar', 'battery'],
    binding: { solar: 10, battery: 10 },
  },
  {
    id: 'sol-batt-laddare',
    name: 'Solar + battery + charger',
    blurb: 'For you with an EV. Maximise self-consumption and home charging.',
    selected: ['solar', 'battery', 'charger'],
    binding: { solar: 10, battery: 10, charger: 10 },
  },
  {
    id: 'totalt',
    name: 'The full ecosystem',
    blurb: 'Solar, battery, charger and electricity contract. Maximum bundle discount: 20%.',
    selected: ['solar', 'battery', 'charger', 'electricity'],
    binding: { solar: 10, battery: 10, charger: 10 },
  },
  {
    id: 'flex-elavtal',
    name: 'Electricity only',
    blurb: 'Spot price + 10 öre/kWh. No lock-in. No hidden fees.',
    selected: ['electricity'],
    binding: {},
  },
]

export function BundleOverview({ data: _data }: { data: Record<string, unknown> }) {
  const { setContentView } = useAppStore()

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
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
          Energai Flex
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-display-sm)',
            fontWeight: 700,
            color: 'var(--color-black)',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          Suggested packages
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-md)',
            color: 'var(--color-gray-700)',
            margin: 0,
            maxWidth: '60ch',
          }}
        >
          Two numbers, always: a fixed monthly cost for the hardware + spot price + 10 öre/kWh for
          the electricity. The more of the ecosystem you choose, the bigger the bundle discount on the
          fixed part. Build your own or start from one of these suggestions.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {PRESETS.map((p) => {
          const calc = calculateFlex(
            p.selected.map((id) => ({
              productId: id,
              bindingYears: FLEX_PRODUCTS.find((x) => x.id === id)?.hasBinding ? p.binding[id] ?? 10 : undefined,
            }))
          )
          const productNames = p.selected.map((id) => FLEX_PRODUCTS.find((x) => x.id === id)!.name)
          const isHero = p.id === 'totalt'

          return (
            <article
              key={p.id}
              style={{
                padding: 'var(--space-5)',
                background: isHero ? 'var(--color-black)' : 'var(--color-white)',
                color: isHero ? 'var(--color-white)' : 'var(--color-black)',
                borderLeft: `3px solid ${isHero || calc.bundleDiscountPct > 0 ? 'var(--color-accent)' : 'var(--color-gray-200)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: 0 }}>
                {p.name}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {productNames.map((n) => (
                  <li key={n} style={{ fontSize: 'var(--type-body-sm)', color: isHero ? 'var(--color-gray-300)' : 'var(--color-gray-700)' }}>
                    • {n}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'var(--space-2)' }}>
                {calc.fixedMonthly > 0 ? (
                  <>
                    {calc.fixedMonthlyDiscount > 0 && (
                      <span
                        style={{
                          fontSize: 'var(--type-body-sm)',
                          color: isHero ? 'var(--color-gray-500)' : 'var(--color-gray-400)',
                          textDecoration: 'line-through',
                          display: 'block',
                        }}
                      >
                        {calc.fixedMonthlyBase.toLocaleString('sv-SE')} kr/mo
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 'var(--type-display-sm)',
                        fontWeight: 700,
                        lineHeight: 1,
                        color: isHero ? 'var(--color-accent)' : 'var(--color-black)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {calc.fixedMonthly.toLocaleString('sv-SE')}
                      <span style={{ fontSize: 'var(--type-body-md)', color: isHero ? 'var(--color-gray-300)' : 'var(--color-gray-600)', fontWeight: 400 }}>
                        {' '}
                        kr/mo
                      </span>
                    </span>
                    {calc.bundleDiscountPct > 0 && (
                      <span style={{ display: 'block', fontWeight: 600, color: 'var(--color-accent)', marginTop: 4 }}>
                        Bundle discount −{Math.round(calc.bundleDiscountPct * 100)} %
                      </span>
                    )}
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: 'var(--type-display-sm)',
                      fontWeight: 700,
                      lineHeight: 1,
                      color: isHero ? 'var(--color-accent)' : 'var(--color-black)',
                    }}
                  >
                    Electricity only
                  </span>
                )}
                <span style={{ display: 'block', fontSize: 'var(--type-body-sm)', color: isHero ? 'var(--color-gray-300)' : 'var(--color-gray-700)', marginTop: 4 }}>
                  + spot price + 10 öre/kWh
                </span>
              </div>

              <p style={{ fontSize: 'var(--type-body-sm)', color: isHero ? 'var(--color-gray-300)' : 'var(--color-gray-600)', margin: 0, lineHeight: 1.5 }}>
                {p.blurb}
              </p>

              <button
                onClick={() =>
                  setContentView('flex-builder', {
                    selected: p.selected,
                    binding: p.binding,
                  })
                }
                style={{
                  background: isHero ? 'var(--color-accent)' : 'transparent',
                  color: isHero ? 'var(--color-black)' : 'var(--color-black)',
                  padding: '12px 20px',
                  border: isHero ? 'none' : '1.5px solid var(--color-black)',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                  marginTop: 'var(--space-2)',
                }}
              >
                Customise further →
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
