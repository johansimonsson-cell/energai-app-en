'use client'

import { useEffect, useState } from 'react'
import type { PriceArea, Granularity, SpotStats } from '@/lib/marketData'

/**
 * Vy 37: market-insight – linjediagram + AI-insikt-kort.
 * Källa: kravspec-uppdatering-2026-04.md §3.5 #37
 */
function parseArea(raw: unknown): PriceArea {
  const valid: PriceArea[] = ['SE1', 'SE2', 'SE3', 'SE4']
  const cleaned = String(raw ?? '').replace(/[<>]/g, '').toUpperCase().trim()
  return (valid.find((a) => a === cleaned) as PriceArea) ?? 'SE3'
}

export function MarketInsightView({ data }: { data: Record<string, unknown> }) {
  const initialArea = parseArea(data?.area)
  const [area, setArea] = useState<PriceArea>(initialArea)
  const [granularity, setGranularity] = useState<Granularity>('day')
  const [points, setPoints] = useState<{ ts: string; ore_per_kwh: number }[]>([])
  const [stats, setStats] = useState<SpotStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const to = new Date()
    const from = new Date(to.getTime() - (granularity === 'hour' ? 14 : 365) * 86400_000)
    Promise.all([
      fetch(
        `/api/market-data/spot?area=${area}&from=${from.toISOString()}&to=${to.toISOString()}&granularity=${granularity}`
      ).then((r) => r.json()),
      fetch(`/api/market-data/stats?area=${area}&period=last_12_months`).then((r) => r.json()),
    ])
      .then(([spotRes, statsRes]) => {
        setPoints(spotRes.points ?? [])
        setStats(statsRes)
      })
      .catch(() => {
        setPoints([])
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [area, granularity])

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <header>
          <span
            style={{
              fontSize: 'var(--type-label-md)',
              color: 'var(--color-gray-600)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Electricity market — demo data
          </span>
          <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>
            Spot prices in {area}
          </h2>
        </header>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Pills value={area} options={['SE1', 'SE2', 'SE3', 'SE4']} onChange={(v) => setArea(v as PriceArea)} />
          <Pills value={granularity} options={['hour', 'day', 'month']} onChange={(v) => setGranularity(v as Granularity)} />
        </div>

        <LineChart points={points} loading={loading} />
      </div>

      <aside
        style={{
          padding: 'var(--space-5)',
          background: 'var(--color-black)',
          color: 'var(--color-white)',
          borderLeft: '3px solid var(--color-accent)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          AI insight
        </span>
        {stats ? (
          <>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Average price in <strong>{stats.area}</strong> last 12 months:{' '}
              <strong>{stats.averageOre} öre/kWh</strong>.
            </p>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Average daily variance: <strong>{(stats.averageDailyVarianceOre / 100).toFixed(2)} kr</strong>
              {stats.averageDailyVarianceOre > 80 ? ' — which makes a battery interesting.' : ' — relatively flat.'}
            </p>
            <p style={{ margin: 0, color: 'var(--color-gray-400)', fontSize: 'var(--type-body-sm)' }}>
              p10/p90: {stats.p10Ore} / {stats.p90Ore} öre
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </aside>
    </section>
  )
}

function Pills({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex' }}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: value === o ? 'var(--color-black)' : 'var(--color-gray-100)',
            color: value === o ? 'var(--color-white)' : 'var(--color-gray-800)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: 'var(--type-label-md)',
            letterSpacing: '0.05em',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function LineChart({ points, loading }: { points: { ts: string; ore_per_kwh: number }[]; loading: boolean }) {
  const w = 720
  const h = 240
  const padX = 36
  const padY = 24
  if (loading) return <div style={{ height: h, color: 'var(--color-gray-500)' }}>Loading...</div>
  if (!points.length) return <div style={{ height: h }}>Ingen data</div>
  const values = points.map((p) => p.ore_per_kwh)
  const max = Math.max(...values)
  const min = Math.min(0, ...values)
  const x = (i: number) => padX + (i / (points.length - 1)) * (w - padX * 2)
  const y = (v: number) => h - padY - ((v - min) / (max - min)) * (h - padY * 2)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', background: 'var(--color-gray-50)' }}>
      <polyline
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
      />
      <text x={padX} y={padY - 6} fontFamily="var(--font-primary)" fontSize="11" fill="var(--color-gray-600)">
        max {max.toFixed(0)} öre
      </text>
      <text x={padX} y={h - 6} fontFamily="var(--font-primary)" fontSize="11" fill="var(--color-gray-600)">
        min {min.toFixed(0)} öre
      </text>
    </svg>
  )
}
