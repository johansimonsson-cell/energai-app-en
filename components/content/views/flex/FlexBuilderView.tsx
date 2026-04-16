'use client'

import { useMemo, useState } from 'react'
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
 * View 32: flex-builder
 * The customer builds their own energy package: products + commitment period -> fixed + variable cost.
 * Source: requirements update 2026-04.md section 1.4 #32
 */
export function FlexBuilderView({ data }: { data: Record<string, unknown> }) {
  const initialSelected = (data?.selected as FlexProductId[] | undefined) ?? ['solar', 'battery']
  const initialBinding = (data?.binding as Record<string, BindingYears> | undefined) ?? {
    solar: 10,
    battery: 10,
    charger: 10,
  }
  const area = (data?.area as string) ?? 'SE3'
  const annualKwh = (data?.annualKwh as number) ?? 18000
  const spotAvg = (data?.spotAverageOre as number) ?? 87

  const { includeNetworkFee, setContentView } = useAppStore()

  const [selected, setSelected] = useState<FlexProductId[]>(initialSelected)
  const [binding, setBinding] = useState<Record<string, BindingYears>>(initialBinding)

  const calc = useMemo(() => {
    return calculateFlex(
      selected.map((id) => {
        const p = FLEX_PRODUCTS.find((x) => x.id === id)!
        return {
          productId: id,
          bindingYears: p.hasBinding ? (binding[id] ?? 10) : undefined,
        }
      })
    )
  }, [selected, binding])

  const variableMonthly = estimateVariableMonthly({
    annualKwh,
    spotAverageOrePerKwh: spotAvg,
    includeNetworkFee,
    area,
  })

  const toggleProduct = (id: FlexProductId) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const setBindingFor = (id: FlexProductId, years: BindingYears) =>
    setBinding((b) => ({ ...b, [id]: years }))

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
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
          <h2
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-display-sm)',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Build your energy package
          </h2>
          <p style={{ color: 'var(--color-gray-700)', maxWidth: 520, margin: 0 }}>
            Choose products, set the commitment period for hardware, and see exactly what you pay now
            and when the commitment ends. Two numbers, always: fixed part + variable electricity price.
          </p>
        </header>

        {/* Step 1 — products */}
        <Step number={1} title="Choose products">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {FLEX_PRODUCTS.map((p) => {
              const isOn = selected.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  style={{
                    textAlign: 'left',
                    padding: 'var(--space-5)',
                    borderLeft: `3px solid ${isOn ? 'var(--color-accent)' : 'var(--color-gray-200)'}`,
                    background: isOn ? 'var(--color-white)' : 'var(--color-gray-50)',
                    border: 'none',
                    borderLeftWidth: 3,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                    boxShadow: isOn ? '0 0 0 1px var(--color-gray-200)' : 'none',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 'var(--type-body-lg)' }}>{p.name}</span>
                  <span style={{ color: 'var(--color-gray-700)', fontSize: 'var(--type-body-sm)' }}>
                    {p.shortDescription}
                  </span>
                </button>
              )
            })}
          </div>
        </Step>

        {/* Step 2 — commitment period */}
        <Step number={2} title="Choose commitment period per hardware">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {selected
              .map((id) => FLEX_PRODUCTS.find((p) => p.id === id)!)
              .filter((p) => p.hasBinding)
              .map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-white)',
                    borderLeft: '3px solid var(--color-gray-200)',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {[5, 10, 15].map((y) => {
                      const yrs = y as BindingYears
                      const active = (binding[p.id] ?? 10) === yrs
                      return (
                        <button
                          key={y}
                          onClick={() => setBindingFor(p.id, yrs)}
                          style={{
                            padding: 'var(--space-2) var(--space-4)',
                            border: 'none',
                            background: active ? 'var(--color-black)' : 'var(--color-gray-50)',
                            color: active ? 'var(--color-white)' : 'var(--color-gray-800)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontFamily: 'var(--font-primary)',
                          }}
                        >
                          {y} yrs
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            {!selected.some((id) => FLEX_PRODUCTS.find((p) => p.id === id)?.hasBinding) && (
              <p style={{ color: 'var(--color-gray-600)' }}>
                No hardware products selected. The commitment period only applies to hardware.
              </p>
            )}
          </div>
        </Step>

        <button
          onClick={() =>
            setContentView('binding-explainer', {
              productId: selected.find((id) => FLEX_PRODUCTS.find((p) => p.id === id)?.hasBinding) ?? 'solar',
            })
          }
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-gray-700)',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'var(--font-primary)',
          }}
        >
          What does the commitment period mean? →
        </button>
      </div>

      {/* Sticky summary */}
      <aside
        style={{
          position: 'sticky',
          top: 0,
          alignSelf: 'start',
          padding: 'var(--space-6)',
          background: 'var(--color-black)',
          color: 'var(--color-white)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
          borderLeft: '3px solid var(--color-accent)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-label-md)',
            color: 'var(--color-gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Your package
        </span>

        <div>
          <span style={{ display: 'block', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-400)' }}>
            Fixed monthly cost
          </span>
          {calc.fixedMonthlyDiscount > 0 && (
            <span
              style={{
                display: 'block',
                fontSize: 'var(--type-body-sm)',
                color: 'var(--color-gray-500)',
                textDecoration: 'line-through',
              }}
            >
              {calc.fixedMonthlyBase.toLocaleString('sv-SE')} kr/mo
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-display-md)',
              fontWeight: 700,
              color: 'var(--color-accent)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {calc.fixedMonthly.toLocaleString('sv-SE')}
            <span style={{ fontSize: 'var(--type-body-md)', color: 'var(--color-gray-300)' }}> kr/mo</span>
          </span>
          {calc.bundleDiscountPct > 0 && (
            <span style={{ fontSize: 'var(--type-body-sm)', color: 'var(--color-accent)' }}>
              Bundle discount −{Math.round(calc.bundleDiscountPct * 100)} %
            </span>
          )}
        </div>

        <div>
          <span style={{ display: 'block', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-400)' }}>
            Variable part (electricity price)
          </span>
          <span style={{ fontWeight: 600 }}>spot + 10 öre/kWh</span>
          {includeNetworkFee && (
            <span style={{ display: 'block', color: 'var(--color-gray-300)', fontSize: 'var(--type-body-sm)' }}>
              + network fee {getNetworkFee(area)} öre/kWh ({area})
            </span>
          )}
          <span style={{ display: 'block', marginTop: 'var(--space-2)', color: 'var(--color-gray-300)' }}>
            ≈ {variableMonthly.toLocaleString('sv-SE')} kr/mo (at {annualKwh.toLocaleString('sv-SE')} kWh/year)
          </span>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <NetworkFeeToggle dark />
          </div>
        </div>

        {/* Timeline */}
        <div style={{ borderTop: '1px solid var(--color-gray-800)', paddingTop: 'var(--space-4)' }}>
          <span
            style={{
              display: 'block',
              fontSize: 'var(--type-label-md)',
              color: 'var(--color-gray-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-2)',
            }}
          >
            Timeline
          </span>
          {calc.longestBindingYears > 0 ? (
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              <strong>Year 0–{calc.longestBindingYears}:</strong> {calc.fixedMonthly.toLocaleString('sv-SE')} kr/mo +
              electricity
              <br />
              <strong>Year {calc.longestBindingYears}+:</strong> electricity only (spot + 10 öre)
            </p>
          ) : (
            <p style={{ margin: 0 }}>Electricity contract only — variable cost only, no lock-in.</p>
          )}
        </div>

        <button
          onClick={() =>
            setContentView('signup-form', {
              flex: { selected, binding, calc },
            })
          }
          style={{
            marginTop: 'var(--space-3)',
            padding: 'var(--space-4)',
            background: 'var(--color-accent)',
            color: 'var(--color-black)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-md)',
          }}
        >
          Continue →
        </button>
        <button
          onClick={() => setContentView('price-breakdown', { selected, binding, area, annualKwh, spotAvg })}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-gray-700)',
            color: 'var(--color-white)',
            padding: 'var(--space-3)',
            cursor: 'pointer',
            fontFamily: 'var(--font-primary)',
          }}
        >
          Show full cost breakdown
        </button>
      </aside>
    </section>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-label-md)',
            color: 'var(--color-gray-500)',
            letterSpacing: '0.05em',
          }}
        >
          STEP {number}
        </span>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}
