'use client'

import { FLEX_PRODUCTS, type BindingYears, type FlexProductId } from '@/lib/flex/catalog'

/**
 * View 34: binding-explainer — three cards + comparison line chart over 20 years.
 * Source: requirements update 2026-04.md section 1.4 #34
 */
export function BindingExplainerView({ data }: { data: Record<string, unknown> }) {
  const productId = (data?.productId as FlexProductId) ?? 'solar'
  const product = FLEX_PRODUCTS.find((p) => p.id === productId) ?? FLEX_PRODUCTS[1]
  if (!product.hasBinding || !product.monthlyByBinding) return null

  const bindings: BindingYears[] = [5, 10, 15]
  const horizonYears = 20

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
          Commitment period = ownership
        </span>
        <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>
          {product.name} — choose your pace
        </h2>
        <p style={{ color: 'var(--color-gray-700)', maxWidth: 720 }}>
          The commitment period is how quickly you pay off the hardware. Short commitment = higher
          monthly cost but you own it sooner. Long commitment = lower monthly cost. The total cost is
          roughly the same — it is the cash flow that differs.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
        }}
      >
        {bindings.map((y) => {
          const monthly = product.monthlyByBinding![y]
          const total = monthly * 12 * y
          const apr = product.effectiveAprByBinding?.[y] ?? 4
          return (
            <article
              key={y}
              style={{
                padding: 'var(--space-6)',
                background: 'var(--color-white)',
                borderLeft: `3px solid ${y === 10 ? 'var(--color-accent)' : 'var(--color-gray-300)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-md)',
                  color: 'var(--color-gray-600)',
                  letterSpacing: '0.05em',
                }}
              >
                {y} YEARS
              </span>
              <span
                style={{
                  fontSize: 'var(--type-display-sm)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {monthly.toLocaleString('sv-SE')}
                <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-600)' }}> kr/mo</span>
              </span>
              <span style={{ color: 'var(--color-gray-700)' }}>
                Total: <strong>{total.toLocaleString('sv-SE')} kr</strong>
              </span>
              <span style={{ color: 'var(--color-gray-700)' }}>
                You own the hardware after <strong>{y} years</strong>
              </span>
              <span style={{ color: 'var(--color-gray-600)', fontSize: 'var(--type-body-sm)' }}>
                Effective APR ≈ {apr} %
              </span>
            </article>
          )
        })}
      </div>

      <div>
        <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--type-heading-sm)' }}>
          Cumulative cost over {horizonYears} years
        </h3>
        <CumulativeChart product={product} bindings={bindings} horizonYears={horizonYears} />
      </div>
    </section>
  )
}

function CumulativeChart({
  product,
  bindings,
  horizonYears,
}: {
  product: ReturnType<typeof FLEX_PRODUCTS.find> & { monthlyByBinding?: Record<BindingYears, number> }
  bindings: BindingYears[]
  horizonYears: number
}) {
  if (!product?.monthlyByBinding) return null
  const w = 720
  const h = 240
  const padX = 36
  const padY = 24
  // Curves
  const points = bindings.map((b) => {
    const monthly = product.monthlyByBinding![b]
    const data: number[] = []
    let cum = 0
    for (let y = 0; y <= horizonYears; y++) {
      if (y > 0 && y <= b) cum += monthly * 12
      data.push(cum)
    }
    return { binding: b, data }
  })
  const max = Math.max(...points.flatMap((p) => p.data))
  const colors: Record<BindingYears, string> = {
    5: 'var(--color-gray-700)',
    10: 'var(--color-accent)',
    15: 'var(--color-gray-400)',
  }
  const x = (i: number) => padX + (i / horizonYears) * (w - padX * 2)
  const y = (v: number) => h - padY - (v / max) * (h - padY * 2)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', background: 'var(--color-gray-50)' }}>
      {/* Y grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={w - padX}
          y1={padY + t * (h - padY * 2)}
          y2={padY + t * (h - padY * 2)}
          stroke="var(--color-gray-200)"
          strokeWidth={1}
        />
      ))}
      {points.map(({ binding, data }) => (
        <polyline
          key={binding}
          fill="none"
          stroke={colors[binding]}
          strokeWidth={3}
          points={data.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
        />
      ))}
      {/* Legend */}
      {points.map(({ binding }, idx) => (
        <g key={binding} transform={`translate(${padX + idx * 110}, ${padY - 4})`}>
          <rect width="14" height="14" fill={colors[binding]} />
          <text x="20" y="12" fontFamily="var(--font-primary)" fontSize="12">
            {binding} yrs
          </text>
        </g>
      ))}
      {/* X labels */}
      {[0, 5, 10, 15, 20].map((yr) => (
        <text
          key={yr}
          x={x(yr)}
          y={h - 4}
          fontFamily="var(--font-primary)"
          fontSize="11"
          fill="var(--color-gray-600)"
          textAnchor="middle"
        >
          Year {yr}
        </text>
      ))}
    </svg>
  )
}
