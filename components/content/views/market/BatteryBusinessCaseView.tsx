'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import type { PriceArea, BatteryRoi } from '@/lib/marketData'

/**
 * View 38: battery-business-case — market daily curve + customer profile + ROI.
 * Source: requirements update 2026-04.md section 3.5 #38
 */
export function BatteryBusinessCaseView({ data }: { data: Record<string, unknown> }) {
  const area = (data?.area as PriceArea) ?? 'SE3'
  const batteryKwh = (data?.batteryKwh as number) ?? 10
  const { setContentView } = useAppStore()

  const [roi, setRoi] = useState<BatteryRoi | null>(null)
  const [curve, setCurve] = useState<number[]>([])

  useEffect(() => {
    fetch(`/api/market-data/battery-roi?area=${area}&battery_kwh=${batteryKwh}`)
      .then((r) => r.json())
      .then(setRoi)
    // Fetch hourly for daily curve via stats endpoint. We don't have a separate endpoint;
    // approximate via spot hour last 30 days and aggregate client-side.
    const to = new Date()
    const from = new Date(to.getTime() - 30 * 86400_000)
    fetch(`/api/market-data/spot?area=${area}&from=${from.toISOString()}&to=${to.toISOString()}&granularity=hour`)
      .then((r) => r.json())
      .then((d: { points: { ts: string; ore_per_kwh: number }[] }) => {
        const sums = new Array(24).fill(0)
        const counts = new Array(24).fill(0)
        d.points.forEach((p) => {
          const h = new Date(p.ts).getUTCHours()
          sums[h] += p.ore_per_kwh
          counts[h] += 1
        })
        setCurve(sums.map((s, i) => Math.round((s / Math.max(1, counts[i])) * 10) / 10))
      })
  }, [area, batteryKwh])

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Is a battery worth it for you?
        </span>
        <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>
          Business case: {batteryKwh} kWh battery in {area}
        </h2>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--type-heading-sm)' }}>The market</h3>
          <DailyCurve curve={curve} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--type-heading-sm)' }}>You</h3>
          <DailyCurve
            curve={
              // Typical villa profile: morning peak + evening peak
              Array.from({ length: 24 }, (_, h) => {
                const morning = Math.exp(-Math.pow((h - 7) / 1.5, 2)) * 1.4
                const evening = Math.exp(-Math.pow((h - 19) / 2, 2)) * 1.6
                return Math.round((0.4 + morning + evening) * 100) / 100
              })
            }
            unit="kWh"
          />
        </div>
      </div>

      {roi && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <Stat label="Annual savings" value={`${roi.annualSavings.toLocaleString('sv-SE')} kr`} />
          <Stat label="Payback period" value={`${roi.paybackYears} years`} />
        </div>
      )}

      {roi && (
        <p style={{ color: 'var(--color-gray-700)' }}>
          {roi.notes} Efficiency in calculation: {Math.round(roi.efficiency * 100)} %.
        </p>
      )}

      <div style={{ padding: 'var(--space-5)', background: 'var(--color-gray-50)', borderLeft: '3px solid var(--color-accent)' }}>
        <strong>Sensitivity analysis:</strong> If daily variance increases (more volatile prices), the ROI improves.
        If prices flatten out, it worsens. Our model assumes current patterns continue.
      </div>

      <button
        onClick={() => setContentView('flex-builder', { selected: ['battery'], binding: { battery: 10 } })}
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
        Build package with battery →
      </button>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 'var(--space-5)', background: 'var(--color-black)', color: 'var(--color-white)', borderLeft: '3px solid var(--color-accent)' }}>
      <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, lineHeight: 1, marginTop: 'var(--space-2)', color: 'var(--color-accent)' }}>{value}</div>
    </div>
  )
}

function DailyCurve({ curve, unit = 'öre' }: { curve: number[]; unit?: string }) {
  const w = 320
  const h = 160
  if (!curve.length) return <div style={{ height: h, color: 'var(--color-gray-500)' }}>Loading...</div>
  const max = Math.max(...curve)
  const min = Math.min(0, ...curve)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', background: 'var(--color-gray-50)' }}>
      {/* Peak/valley zones */}
      <rect x={(7 / 24) * w} y="0" width={((9 - 7) / 24) * w} height={h} fill="rgba(34,197,94,0.06)" />
      <rect x={(17 / 24) * w} y="0" width={((20 - 17) / 24) * w} height={h} fill="rgba(34,197,94,0.06)" />
      <polyline
        fill="none"
        stroke="var(--color-black)"
        strokeWidth={2}
        points={curve.map((v, i) => `${(i / 23) * w},${h - 16 - ((v - min) / (max - min || 1)) * (h - 32)}`).join(' ')}
      />
      <text x={4} y={12} fontFamily="var(--font-primary)" fontSize="10" fill="var(--color-gray-600)">
        max {max.toFixed(0)} {unit}
      </text>
    </svg>
  )
}
