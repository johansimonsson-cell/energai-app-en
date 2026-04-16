'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import type { PriceArea, SolarRoi } from '@/lib/marketData'

/**
 * View 39: solar-business-case — annual production, revenue, ROI for solar.
 * Source: requirements update 2026-04.md section 3.5 #39
 */
export function SolarBusinessCaseView({ data }: { data: Record<string, unknown> }) {
  const area = (data?.area as PriceArea) ?? 'SE3'
  const kwp = (data?.kwp as number) ?? 10
  const orientation = (data?.orientation as 'south' | 'east' | 'west' | 'north') ?? 'south'
  const { setContentView } = useAppStore()

  const [roi, setRoi] = useState<SolarRoi | null>(null)
  useEffect(() => {
    fetch(`/api/market-data/solar-roi?area=${area}&kwp=${kwp}&roof_orientation=${orientation}`)
      .then((r) => r.json())
      .then(setRoi)
  }, [area, kwp, orientation])

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Solar economics
        </span>
        <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>
          {kwp} kWp • {area} • {orientation === 'south' ? 'south' : orientation}
        </h2>
      </header>

      {roi && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            <Stat label="Annual production" value={`${roi.annualProductionKwh.toLocaleString('sv-SE')} kWh`} />
            <Stat label="Annual revenue" value={`${roi.annualRevenueSek.toLocaleString('sv-SE')} kr`} highlight />
            <Stat label="Payback period" value={`${roi.paybackYears} years`} />
          </div>
          <p style={{ color: 'var(--color-gray-700)' }}>
            Assumptions: ROT/green deduction included. {Math.round(roi.selfUseShare * 100)} % self-consumption,{' '}
            {Math.round(roi.surplusShare * 100)} % surplus sold at spot price − 5 öre.
            Average spot {roi.area}: {roi.averageSpotKr.toFixed(2)} kr/kWh.
          </p>
        </>
      )}

      <div style={{ padding: 'var(--space-5)', background: 'var(--color-gray-50)', borderLeft: '3px solid var(--color-accent)' }}>
        <strong>Key insight:</strong> Self-consumed solar replaces your purchase price (spot + 10 öre + network if applicable).
        Surplus is sold at a lower price, but is subsidised by the tax reduction.
      </div>

      <button
        onClick={() => setContentView('flex-builder', { selected: ['solar', 'battery'], binding: { solar: 10, battery: 10 } })}
        style={{
          alignSelf: 'flex-start',
          padding: 'var(--space-4) var(--space-6)',
          background: 'var(--color-black)',
          color: 'var(--color-white)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-primary)',
          fontWeight: 700,
        }}
      >
        Build package with solar →
      </button>
    </section>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        padding: 'var(--space-5)',
        background: highlight ? 'var(--color-black)' : 'var(--color-white)',
        color: highlight ? 'var(--color-white)' : 'var(--color-black)',
        borderLeft: `3px solid ${highlight ? 'var(--color-accent)' : 'var(--color-gray-300)'}`,
      }}
    >
      <span style={{ fontSize: 'var(--type-label-md)', color: highlight ? 'var(--color-gray-400)' : 'var(--color-gray-600)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, lineHeight: 1, marginTop: 'var(--space-2)', color: highlight ? 'var(--color-accent)' : 'var(--color-black)' }}>{value}</div>
    </div>
  )
}
