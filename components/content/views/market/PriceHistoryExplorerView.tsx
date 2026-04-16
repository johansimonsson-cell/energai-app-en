'use client'

import { useEffect, useState } from 'react'
import type { PriceArea, Granularity } from '@/lib/marketData'

/**
 * View 40: price-history-explorer — advanced explorer for data enthusiasts/professionals.
 * Source: requirements update 2026-04.md section 3.5 #40
 */
export function PriceHistoryExplorerView({ data }: { data: Record<string, unknown> }) {
  const [area, setArea] = useState<PriceArea>((data?.area as PriceArea) ?? 'SE3')
  const [granularity, setGranularity] = useState<Granularity>('day')
  const [from, setFrom] = useState<string>(new Date(Date.now() - 90 * 86400_000).toISOString().slice(0, 10))
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10))
  const [points, setPoints] = useState<{ ts: string; ore_per_kwh: number }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(
      `/api/market-data/spot?area=${area}&from=${from}&to=${to}&granularity=${granularity}`
    )
      .then((r) => r.json())
      .then((d) => setPoints(d.points))
      .finally(() => setLoading(false))
  }, [area, granularity, from, to])

  const exportCsv = () => {
    const csv = ['ts,area,ore_per_kwh', ...points.map((p) => `${p.ts},${area},${p.ore_per_kwh}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spot_${area}_${from}_${to}_${granularity}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header>
        <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Advanced explorer
        </span>
        <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>Price history</h2>
      </header>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Field label="Area">
          <select value={area} onChange={(e) => setArea(e.target.value as PriceArea)} style={inputStyle}>
            <option>SE1</option>
            <option>SE2</option>
            <option>SE3</option>
            <option>SE4</option>
          </select>
        </Field>
        <Field label="Granularity">
          <select value={granularity} onChange={(e) => setGranularity(e.target.value as Granularity)} style={inputStyle}>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="month">Month</option>
          </select>
        </Field>
        <Field label="From">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="To">
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} />
        </Field>
        <button onClick={exportCsv} style={{ padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--color-gray-400)', background: 'var(--color-white)', cursor: 'pointer', fontFamily: 'var(--font-primary)' }}>
          Export CSV
        </button>
      </div>

      <div style={{ height: 240, background: 'var(--color-gray-50)', position: 'relative', padding: 'var(--space-4)' }}>
        {loading ? (
          <span style={{ color: 'var(--color-gray-500)' }}>Loading...</span>
        ) : (
          <Chart points={points} />
        )}
      </div>

      <div style={{ overflowX: 'auto', maxHeight: 320 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-gray-300)', background: 'var(--color-white)', position: 'sticky', top: 0 }}>
              <th style={{ textAlign: 'left', padding: 'var(--space-2)' }}>Time</th>
              <th style={{ textAlign: 'right', padding: 'var(--space-2)' }}>öre/kWh</th>
            </tr>
          </thead>
          <tbody>
            {points.slice(0, 200).map((p) => (
              <tr key={p.ts} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                <td style={{ padding: 'var(--space-2)' }}>{p.ts}</td>
                <td style={{ padding: 'var(--space-2)', textAlign: 'right' }}>{p.ore_per_kwh}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {points.length > 200 && (
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--type-body-sm)' }}>
            Showing 200 of {points.length} rows. Export CSV for complete data.
          </p>
        )}
      </div>
    </section>
  )
}

const inputStyle: React.CSSProperties = {
  padding: 'var(--space-2) var(--space-3)',
  border: '1px solid var(--color-gray-300)',
  background: 'var(--color-white)',
  fontFamily: 'var(--font-primary)',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      {children}
    </label>
  )
}

function Chart({ points }: { points: { ts: string; ore_per_kwh: number }[] }) {
  if (!points.length) return <span>No data</span>
  const w = 720
  const h = 200
  const values = points.map((p) => p.ore_per_kwh)
  const max = Math.max(...values)
  const min = Math.min(0, ...values)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <polyline
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        points={values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(' ')}
      />
    </svg>
  )
}
