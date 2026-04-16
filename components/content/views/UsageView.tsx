'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Period = 'day' | 'week' | 'month'

function generateMockData(period: Period) {
  if (period === 'day') {
    return Array.from({ length: 24 }, (_, i) => ({
      label: `${String(i).padStart(2, '0')}:00`,
      current: Math.round(0.3 + Math.random() * 1.2),
      previous: Math.round(0.2 + Math.random() * 1.0),
      forecast: i > 16 ? Math.round(0.4 + Math.random() * 0.8) : undefined,
    }))
  }
  if (period === 'week') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((d) => ({
      label: d,
      current: Math.round(8 + Math.random() * 6),
      previous: Math.round(7 + Math.random() * 5),
      forecast: undefined,
    }))
  }
  // month
  return Array.from({ length: 12 }, (_, i) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return {
      label: months[i],
      current: i <= 3 ? Math.round(250 + Math.random() * 100) : undefined,
      previous: Math.round(220 + Math.random() * 120),
      forecast: i > 3 ? Math.round(200 + Math.random() * 80) : undefined,
    }
  })
}

export function UsageView({ data: _data }: { data: Record<string, unknown> }) {
  const [period, setPeriod] = useState<Period>('month')
  const chartData = generateMockData(period)

  const unitLabel = period === 'day' ? 'kWh/h' : period === 'week' ? 'kWh/day' : 'kWh'

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        gap: 'var(--space-8)',
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-lg)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.005em',
            color: 'var(--color-black)',
            margin: '0 0 var(--space-6) 0',
          }}
        >
          Usage
        </h2>

        {/* Period selector */}
        <nav
          aria-label="Time period"
          style={{
            display: 'flex',
            gap: 'var(--space-6)',
          }}
        >
          {([
            { key: 'day' as const, label: 'Day' },
            { key: 'week' as const, label: 'Week' },
            { key: 'month' as const, label: 'Month' },
          ]).map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: period === p.key ? '2px solid var(--color-black)' : '2px solid transparent',
                padding: 'var(--space-2) 0',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: period === p.key ? 500 : 400,
                color: period === p.key ? 'var(--color-black)' : 'var(--color-gray-500)',
                cursor: 'pointer',
                minHeight: '44px',
                transition: `color var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default)`,
              }}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Chart — Recharts requires hardcoded hex values, mapped from design tokens:
         #000000 = --color-black, #B3B3B3 = --color-gray-300, #22C55E = --color-accent,
         #8C8C8C = --color-gray-500, #E8E8E8 = --color-gray-100 */}
      <div style={{ width: '100%', height: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              stroke="var(--color-gray-100)"
              strokeWidth={1}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#8C8C8C' }}
              tickLine={false}
              axisLine={{ stroke: '#E8E8E8', strokeWidth: 1 }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#8C8C8C' }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                background: '#000',
                border: 'none',
                borderRadius: 0,
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'var(--font-primary)',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#999' }}
            />
            <Line
              type="linear"
              dataKey="previous"
              stroke="#B3B3B3"
              strokeWidth={1.5}
              dot={false}
              strokeLinecap="square"
              name="Previous period"
              connectNulls={false}
            />
            <Line
              type="linear"
              dataKey="current"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
              strokeLinecap="square"
              name="Current"
              connectNulls={false}
            />
            <Line
              type="linear"
              dataKey="forecast"
              stroke="#22C55E"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
              strokeLinecap="square"
              name="Forecast"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
        {[
          { color: '#000000', label: 'Current', dash: false },
          { color: '#B3B3B3', label: 'Previous period', dash: false },
          { color: '#22C55E', label: 'Forecast', dash: true },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <svg width="24" height="2" aria-hidden="true">
              <line
                x1="0" y1="1" x2="24" y2="1"
                stroke={item.color}
                strokeWidth="2"
                strokeDasharray={item.dash ? '6 4' : 'none'}
                strokeLinecap="square"
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-label-md)',
                color: 'var(--color-gray-600)',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
        }}
      >
        {[
          { value: '312 kWh', label: 'Last 30 days' },
          { value: '10.4 kWh', label: 'Average per day' },
          { value: '−8%', label: 'Compared to last month' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="stagger-item"
            style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
              paddingLeft: i === 0 ? '0' : 'var(--space-6)',
              paddingRight: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-heading-md)',
                fontWeight: 700,
                color: 'var(--color-black)',
                marginBottom: 'var(--space-1)',
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-label-lg)',
                color: 'var(--color-gray-600)',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
