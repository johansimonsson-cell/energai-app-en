'use client'

import { useAppStore } from '@/lib/store'
import { FLEX_PRODUCTS, type FlexProductId, type BindingYears } from '@/lib/flex/catalog'

/**
 * Product catalogue — Energai Flex.
 * Shows the four products with monthly price per commitment period.
 * Source: requirements 2026-04 section 1
 */
export function ProductCatalog({ data: _data }: { data: Record<string, unknown> }) {
  const { setContentView } = useAppStore()
  const bindings: BindingYears[] = [5, 10, 15]

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-label-md)',
            color: 'var(--color-gray-600)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Energai Flex — products
        </span>
        <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
          Products & prices
        </h2>
        <p style={{ color: 'var(--color-gray-700)', margin: 0, maxWidth: '60ch' }}>
          Hardware is amortised as a monthly cost over 5, 10 or 15 years — then you own it. Nothing more.
          Add an electricity contract for spot price + 10 öre/kWh.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {FLEX_PRODUCTS.map((p) => (
          <article
            key={p.id}
            style={{
              padding: 'var(--space-5)',
              background: 'var(--color-white)',
              borderLeft: '3px solid var(--color-accent)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <h3 style={{ fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: 0 }}>{p.name}</h3>
            <p style={{ color: 'var(--color-gray-700)', margin: 0, fontSize: 'var(--type-body-sm)' }}>
              {p.shortDescription}
            </p>

            {p.hasBinding && p.monthlyByBinding ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-primary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--space-1)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Commitment
                    </th>
                    <th style={{ textAlign: 'right', padding: 'var(--space-1)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Monthly price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bindings.map((y) => (
                    <tr key={y} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                      <td style={{ padding: 'var(--space-2) var(--space-1)' }}>{y} years</td>
                      <td style={{ padding: 'var(--space-2) var(--space-1)', textAlign: 'right', fontWeight: 700 }}>
                        {p.monthlyByBinding![y].toLocaleString('sv-SE')} kr/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <span style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, lineHeight: 1, color: 'var(--color-accent)' }}>
                  {p.fixedMonthlyFee} <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-600)' }}>kr/mo</span>
                </span>
                <div style={{ color: 'var(--color-gray-700)', fontSize: 'var(--type-body-sm)' }}>+ spot price + 10 öre/kWh</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
              <button
                onClick={() => setContentView('product-detail', { productSlug: p.id })}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  background: 'transparent',
                  border: '1px solid var(--color-gray-400)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                }}
              >
                Details
              </button>
              <button
                onClick={() =>
                  setContentView('flex-builder', { selected: [p.id as FlexProductId], binding: { [p.id]: 10 } })
                }
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  background: 'var(--color-black)',
                  color: 'var(--color-white)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: 600,
                }}
              >
                Add to package →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
