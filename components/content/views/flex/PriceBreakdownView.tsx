'use client'

import { useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import {
  FLEX_PRODUCTS,
  type BindingYears,
  type FlexProductId,
  calculateFlex,
  estimateVariableMonthly,
  getNetworkFee,
} from '@/lib/flex/catalog'
import { NetworkFeeToggle } from './NetworkFeeToggle'

/**
 * View 33: price-breakdown — show fixed/variable/network, donut, timeline, table.
 * Source: requirements update 2026-04.md section 1.4 #33
 */
export function PriceBreakdownView({ data }: { data: Record<string, unknown> }) {
  const { includeNetworkFee } = useAppStore()
  const selected = (data?.selected as FlexProductId[]) ?? ['solar', 'battery', 'electricity']
  const binding = (data?.binding as Record<string, BindingYears>) ?? {
    solar: 10,
    battery: 10,
    charger: 10,
  }
  const area = (data?.area as string) ?? 'SE3'
  const annualKwh = (data?.annualKwh as number) ?? 18000
  const spotAvg = (data?.spotAvg as number) ?? 87

  const calc = useMemo(
    () =>
      calculateFlex(
        selected.map((id) => ({
          productId: id,
          bindingYears: FLEX_PRODUCTS.find((p) => p.id === id)?.hasBinding ? binding[id] ?? 10 : undefined,
        }))
      ),
    [selected, binding]
  )

  const variableMonthly = estimateVariableMonthly({
    annualKwh,
    spotAverageOrePerKwh: spotAvg,
    includeNetworkFee: false, // donut shows network separately
    area,
  })
  const networkMonthly = Math.round((annualKwh * (getNetworkFee(area) / 100)) / 12)
  const total = calc.fixedMonthly + variableMonthly + (includeNetworkFee ? networkMonthly : 0)
  const segments = [
    { label: 'Fixed part', value: calc.fixedMonthly, color: 'var(--color-accent)' },
    { label: 'Variable part (spot + 10 öre)', value: variableMonthly, color: 'var(--color-gray-700)' },
    ...(includeNetworkFee
      ? [{ label: 'Network fee', value: networkMonthly, color: 'var(--color-gray-400)' }]
      : []),
  ]

  const longest = calc.longestBindingYears || 0
  const years = Array.from({ length: Math.max(longest, 15) }, (_, i) => i + 1)

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-label-md)',
              color: 'var(--color-gray-600)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            What do you pay?
          </span>
          <h2 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>
            Cost breakdown
          </h2>
        </div>
        <NetworkFeeToggle />
      </header>

      {/* Donut + segments */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
        <Donut segments={segments} total={total} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {segments.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block' }} />
              <span style={{ flex: 1 }}>{s.label}</span>
              <span style={{ fontWeight: 700 }}>{s.value.toLocaleString('sv-SE')} kr/mo</span>
            </div>
          ))}
          <div
            style={{
              borderTop: '1px solid var(--color-gray-200)',
              paddingTop: 'var(--space-3)',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
            }}
          >
            <span>Total/mo</span>
            <span>{total.toLocaleString('sv-SE')} kr</span>
          </div>
          <p style={{ color: 'var(--color-gray-700)', fontSize: 'var(--type-body-sm)', margin: 0 }}>
            Our margin is the fixed fee + 10 öre/kWh — nothing hidden.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--type-heading-sm)' }}>Cost year by year</h3>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${years.length}, 1fr)`, gap: 2, alignItems: 'end', height: 140 }}>
          {years.map((y) => {
            const inBinding = y <= longest
            const fixed = inBinding ? calc.fixedMonthly : 0
            const t = fixed + variableMonthly + (includeNetworkFee ? networkMonthly : 0)
            const max = calc.fixedMonthly + variableMonthly + (includeNetworkFee ? networkMonthly : 0)
            const h = (t / max) * 100
            return (
              <div key={y} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div
                  title={`Year ${y}: ${t.toLocaleString('sv-SE')} kr/mo`}
                  style={{
                    width: '100%',
                    height: `${h}%`,
                    background: inBinding ? 'var(--color-black)' : 'var(--color-accent)',
                  }}
                />
                <span style={{ fontSize: 'var(--type-label-sm)', color: 'var(--color-gray-600)' }}>{y}</span>
              </div>
            )
          })}
        </div>
        {longest > 0 && (
          <p style={{ color: 'var(--color-gray-700)', fontSize: 'var(--type-body-sm)', marginTop: 'var(--space-3)' }}>
            <strong>The commitment period ends at year {longest}.</strong> After that you only pay the variable electricity cost.
          </p>
        )}
      </div>

      {/* Table + export */}
      <div>
        <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--type-heading-sm)' }}>Detailed table</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-primary)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
                <Th>Month</Th>
                <Th align="right">Fixed part</Th>
                <Th align="right">Variable (estimate)</Th>
                {includeNetworkFee && <Th align="right">Network fee</Th>}
                <Th align="right">Total</Th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, m) => {
                const fixed = calc.fixedMonthly
                const total = fixed + variableMonthly + (includeNetworkFee ? networkMonthly : 0)
                return (
                  <tr key={m} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                    <Td>Month {m + 1}</Td>
                    <Td align="right">{fixed.toLocaleString('sv-SE')} kr</Td>
                    <Td align="right">{variableMonthly.toLocaleString('sv-SE')} kr</Td>
                    {includeNetworkFee && <Td align="right">{networkMonthly.toLocaleString('sv-SE')} kr</Td>}
                    <Td align="right">
                      <strong>{total.toLocaleString('sv-SE')} kr</strong>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => alert('PDF export is not enabled in the prototype.')}
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3) var(--space-5)',
            border: '1px solid var(--color-gray-400)',
            background: 'var(--color-white)',
            cursor: 'pointer',
            fontFamily: 'var(--font-primary)',
          }}
        >
          Download as PDF
        </button>
      </div>
    </section>
  )
}

function Donut({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[]
  total: number
}) {
  const sum = segments.reduce((a, b) => a + b.value, 0) || 1
  let acc = 0
  const radius = 90
  const strokeW = 28
  const c = 2 * Math.PI * radius
  return (
    <svg viewBox="-110 -110 220 220" style={{ width: '100%', height: 'auto' }}>
      <circle r={radius} cx="0" cy="0" fill="none" stroke="var(--color-gray-100)" strokeWidth={strokeW} />
      {segments.map((s) => {
        const frac = s.value / sum
        const dash = frac * c
        const offset = -acc * c
        acc += frac
        return (
          <circle
            key={s.label}
            r={radius}
            cx="0"
            cy="0"
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={offset}
            transform="rotate(-90)"
          />
        )
      })}
      <text textAnchor="middle" dy="-4" fontFamily="var(--font-primary)" fontSize="14" fill="var(--color-gray-600)">
        Total/mo
      </text>
      <text textAnchor="middle" dy="22" fontFamily="var(--font-primary)" fontSize="28" fontWeight="700">
        {total.toLocaleString('sv-SE')} kr
      </text>
    </svg>
  )
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: 'var(--space-2) var(--space-3)',
        fontWeight: 600,
        fontSize: 'var(--type-label-md)',
        color: 'var(--color-gray-600)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </th>
  )
}
function Td({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: align }}>{children}</td>
}
