'use client'

import { useAppStore } from '@/lib/store'
import { estimateVariableMonthly, getNetworkFee } from '@/lib/flex/catalog'
import { NetworkFeeToggle } from './NetworkFeeToggle'

/**
 * View 35: post-binding-view — large number, new monthly cost, CTA to flex-builder.
 * Source: requirements update 2026-04.md section 1.4 #35
 */
export function PostBindingView({ data }: { data: Record<string, unknown> }) {
  const { includeNetworkFee, setContentView } = useAppStore()
  const monthsLeft = (data?.monthsLeft as number) ?? 6
  const annualKwh = (data?.annualKwh as number) ?? 18000
  const spotAvg = (data?.spotAverageOre as number) ?? 87
  const area = (data?.area as string) ?? 'SE3'
  const currentFixed = (data?.currentFixed as number) ?? 1500

  const newVariable = estimateVariableMonthly({
    annualKwh,
    spotAverageOrePerKwh: spotAvg,
    includeNetworkFee,
    area,
  })

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
          The commitment period is nearing its end
        </span>
        <h2 style={{ fontSize: 'var(--type-display-md)', fontWeight: 700, margin: 0, lineHeight: 1 }}>
          In {monthsLeft} months you will pay
          <br />
          <span style={{ color: 'var(--color-accent)' }}>only for the electricity you use.</span>
        </h2>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Card label="Today" value={`${(currentFixed + newVariable).toLocaleString('sv-SE')} kr/mo`} sub={`Fixed ${currentFixed.toLocaleString('sv-SE')} + electricity ${newVariable.toLocaleString('sv-SE')}`} />
        <Card
          label={`After ${monthsLeft} months`}
          value={`${newVariable.toLocaleString('sv-SE')} kr/mo`}
          sub={`Electricity only (spot + 10 öre${includeNetworkFee ? ` + network ${getNetworkFee(area)} öre` : ''})`}
          highlight
        />
      </div>
      <NetworkFeeToggle />

      <div
        style={{
          padding: 'var(--space-6)',
          background: 'var(--color-gray-50)',
          borderLeft: '3px solid var(--color-accent)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 'var(--type-heading-sm)' }}>Want to expand your package?</h3>
        <p style={{ color: 'var(--color-gray-700)', marginTop: 'var(--space-2)' }}>
          You can add more hardware at any time — e.g. upgrade the battery or add another charger.
          The commitment period only applies to the new hardware.
        </p>
        <button
          onClick={() => setContentView('flex-builder', {})}
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3) var(--space-5)',
            background: 'var(--color-black)',
            color: 'var(--color-white)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }}
        >
          Add more hardware →
        </button>
      </div>
    </section>
  )
}

function Card({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        padding: 'var(--space-6)',
        background: highlight ? 'var(--color-black)' : 'var(--color-white)',
        color: highlight ? 'var(--color-white)' : 'var(--color-black)',
        borderLeft: `3px solid ${highlight ? 'var(--color-accent)' : 'var(--color-gray-300)'}`,
      }}
    >
      <span style={{ fontSize: 'var(--type-label-md)', color: highlight ? 'var(--color-gray-400)' : 'var(--color-gray-600)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, lineHeight: 1, marginTop: 'var(--space-2)' }}>{value}</div>
      <div style={{ marginTop: 'var(--space-2)', color: highlight ? 'var(--color-gray-300)' : 'var(--color-gray-700)', fontSize: 'var(--type-body-sm)' }}>{sub}</div>
    </div>
  )
}
