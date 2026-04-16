'use client'

import { FLEX_PRODUCTS, type BindingYears, type FlexProductId, calculateFlex } from '@/lib/flex/catalog'

/**
 * View 36: flex-confirmation — confirmation variant for Flex packages.
 * Source: requirements update 2026-04.md section 1.4 #36
 */
export function FlexConfirmationView({ data }: { data: Record<string, unknown> }) {
  const selected = (data?.selected as FlexProductId[]) ?? ['solar', 'battery', 'electricity']
  const binding = (data?.binding as Record<string, BindingYears>) ?? { solar: 10, battery: 10 }
  const agreementId = (data?.agreementId as string) ?? `EFX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const calc = calculateFlex(
    selected.map((id) => ({
      productId: id,
      bindingYears: FLEX_PRODUCTS.find((p) => p.id === id)?.hasBinding ? binding[id] ?? 10 : undefined,
    }))
  )

  return (
    <section
      style={{
        padding: 'var(--space-12) var(--space-8)',
        background: 'var(--color-black)',
        color: 'var(--color-white)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <span
        style={{
          fontSize: 'var(--type-label-md)',
          color: 'var(--color-gray-400)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        Contract signed
      </span>
      <h2 style={{ fontSize: 'var(--type-display-lg)', fontWeight: 700, margin: 0, color: 'var(--color-accent)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        Welcome to Energai Flex.
      </h2>
      <p style={{ color: 'var(--color-gray-300)', maxWidth: 580 }}>
        Agreement number: <strong style={{ color: 'var(--color-white)' }}>{agreementId}</strong>. A confirmation will be
        sent to your email shortly. The installation will be booked within 5 business days.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Fixed part</span>
          <div style={{ fontSize: 'var(--type-display-md)', fontWeight: 700 }}>
            {calc.fixedMonthly.toLocaleString('sv-SE')} <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-400)' }}>kr/mo</span>
          </div>
          {calc.bundleDiscountPct > 0 && (
            <span style={{ color: 'var(--color-accent)', fontSize: 'var(--type-body-sm)' }}>
              Bundle discount −{Math.round(calc.bundleDiscountPct * 100)} %
            </span>
          )}
        </div>
        <div style={{ borderLeft: '3px solid var(--color-gray-700)', paddingLeft: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Variable part</span>
          <div style={{ fontSize: 'var(--type-display-md)', fontWeight: 700 }}>spot + 10 öre</div>
          <span style={{ color: 'var(--color-gray-400)' }}>Per kWh, billed monthly.</span>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--type-heading-sm)' }}>Commitment per product</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {selected.map((id) => {
            const p = FLEX_PRODUCTS.find((x) => x.id === id)!
            const yrs = calc.bindingByProduct[id]
            return (
              <li key={id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-800)', padding: 'var(--space-2) 0' }}>
                <span>{p.name}</span>
                <span style={{ color: 'var(--color-gray-400)' }}>
                  {p.hasBinding ? `${yrs} year commitment` : 'No commitment'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
