'use client'

import { useAppStore } from '@/lib/store'
import {
  FLEX_PRODUCTS,
  type FlexProductId,
  type BindingYears,
  getFlexProduct,
} from '@/lib/flex/catalog'
import { useState } from 'react'

/**
 * Product detail — Energai Flex.
 * Source: requirements 2026-04 section 1
 */
export function ProductDetail({ data }: { data: Record<string, unknown> }) {
  const slugRaw = (data?.productSlug as string) || (data?.slug as string) || 'solar'
  // Try to match old slugs to our Flex IDs
  const id: FlexProductId = (() => {
    if (slugRaw.includes('battery') || slugRaw.includes('batteri')) return 'battery'
    if (slugRaw.includes('charger') || slugRaw.includes('laddstolpe') || slugRaw.includes('laddare')) return 'charger'
    if (slugRaw.includes('plan') || slugRaw.includes('elavtal') || slugRaw.includes('electricity')) return 'electricity'
    if (slugRaw === 'solar' || slugRaw.includes('sol')) return 'solar'
    return 'solar'
  })()
  const product = getFlexProduct(id)
  const { setContentView } = useAppStore()
  const [binding, setBinding] = useState<BindingYears>(10)

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
          Energai Flex
        </span>
        <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>{product.name}</h2>
        <p style={{ color: 'var(--color-gray-700)', margin: 0 }}>{product.shortDescription}</p>
      </header>

      {product.hasBinding && product.monthlyByBinding ? (
        <article
          style={{
            padding: 'var(--space-6)',
            background: 'var(--color-white)',
            borderLeft: '3px solid var(--color-accent)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div>
            <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Choose commitment period
            </span>
            <div style={{ display: 'flex', marginTop: 'var(--space-2)' }}>
              {(Object.keys(product.monthlyByBinding) as unknown as BindingYears[]).map((y) => {
                const yrs = Number(y) as BindingYears
                const active = binding === yrs
                return (
                  <button
                    key={yrs}
                    onClick={() => setBinding(yrs)}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: active ? 'var(--color-black)' : 'var(--color-gray-50)',
                      color: active ? 'var(--color-white)' : 'var(--color-gray-800)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontFamily: 'var(--font-primary)',
                    }}
                  >
                    {yrs} years
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 'var(--type-display-md)', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}>
              {product.monthlyByBinding[binding].toLocaleString('sv-SE')}
              <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-700)' }}> kr/mo</span>
            </span>
            <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-gray-700)', marginBottom: 0 }}>
              Total {(product.monthlyByBinding[binding] * 12 * binding).toLocaleString('sv-SE')} kr over {binding} years.
              Effective APR ≈ {product.effectiveAprByBinding?.[binding]} %. You own the hardware after
              {' '}{binding} years — then you only pay the variable electricity cost.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              onClick={() => setContentView('flex-builder', { selected: [id], binding: { [id]: binding } })}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'var(--color-black)',
                color: 'var(--color-white)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontFamily: 'var(--font-primary)',
              }}
            >
              Build package →
            </button>
            <button
              onClick={() => setContentView('binding-explainer', { productId: id })}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'transparent',
                border: '1px solid var(--color-gray-400)',
                cursor: 'pointer',
                fontFamily: 'var(--font-primary)',
              }}
            >
              What does the commitment mean?
            </button>
          </div>
        </article>
      ) : (
        <article
          style={{
            padding: 'var(--space-6)',
            background: 'var(--color-black)',
            color: 'var(--color-white)',
            borderLeft: '3px solid var(--color-accent)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <span style={{ fontSize: 'var(--type-display-md)', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}>
            {product.fixedMonthlyFee} <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-300)' }}>kr/mo</span>
          </span>
          <p style={{ margin: 0 }}>+ spot price + 10 öre/kWh. No lock-in.</p>
          <button
            onClick={() => setContentView('signup-form', { flex: { selected: ['electricity'], binding: {} } })}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'var(--color-accent)',
              color: 'var(--color-black)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              alignSelf: 'flex-start',
            }}
          >
            Sign up →
          </button>
        </article>
      )}
    </section>
  )
}
