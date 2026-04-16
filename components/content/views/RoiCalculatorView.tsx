'use client'

export function RoiCalculatorView({ data }: { data: Record<string, unknown> }) {
  const annualConsumption = (data?.annualConsumption as number) || 15000
  const monthlyElCost = (data?.monthlyElCost as number) || 2500
  const systemProduction = (data?.systemProduction as number) || 10000
  const systemPrice = (data?.systemPrice as number) || 150000
  const greenDeduction = (data?.greenDeduction as number) || 30000
  const rotDeduction = (data?.rotDeduction as number) || 15000
  const chargingSavings = (data?.chargingSavings as number) || 0
  const priceArea = (data?.priceArea as string) || 'SE3'

  const netCost = systemPrice - greenDeduction - rotDeduction
  const elPricePerKwh = (monthlyElCost * 12) / annualConsumption
  const annualSavings = Math.round(systemProduction * elPricePerKwh) + chargingSavings
  const paybackYears = Math.round((netCost / annualSavings) * 10) / 10
  const profit25 = Math.round(annualSavings * 25 - netCost)

  // Simple cumulative savings for bar chart
  const barYears = [1, 5, 10, 15, 20, 25]
  const maxCumulative = annualSavings * 25
  const annualCostWithout = monthlyElCost * 12
  const annualCostWith = Math.round(annualCostWithout - annualSavings)
  const annualCostWithBattery = Math.round(annualCostWith * 0.7)

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* DARK hero section */}
      <div
        style={{
          background: 'var(--color-black)',
          padding: 'var(--space-12) var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-sm)',
            fontWeight: 500,
            color: 'var(--color-gray-500)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}
        >
          Estimated annual savings
        </span>
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-display-lg)',
            fontWeight: 700,
            color: 'var(--color-accent)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {annualSavings.toLocaleString('sv-SE')} kr
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-4)' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)', display: 'block' }}>Payback period</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-white)' }}>{paybackYears} years</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)', display: 'block' }}>Profit after 25 years</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-white)' }}>{profit25.toLocaleString('sv-SE')} kr</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)', display: 'block' }}>Price area</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-white)' }}>{priceArea}</span>
          </div>
        </div>
      </div>

      {/* LIGHT detail section */}
      <div
        style={{
          background: 'var(--color-gray-25)',
          padding: 'var(--space-10) var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-10)',
        }}
      >
        {/* Cost breakdown */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 var(--space-6) 0' }}>Cost overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { label: 'System cost', value: `${systemPrice.toLocaleString('sv-SE')} kr` },
              { label: 'Green deduction', value: `−${greenDeduction.toLocaleString('sv-SE')} kr` },
              { label: 'ROT deduction', value: `−${rotDeduction.toLocaleString('sv-SE')} kr` },
              { label: 'Net cost', value: `${netCost.toLocaleString('sv-SE')} kr`, bold: true },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: (row as { bold?: boolean }).bold ? 700 : 400,
                  color: 'var(--color-black)',
                  padding: 'var(--space-2) 0',
                  borderTop: (row as { bold?: boolean }).bold ? '1px solid var(--color-gray-200)' : 'none',
                }}
              >
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
            {chargingSavings > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  color: 'var(--color-accent)',
                  fontWeight: 500,
                  padding: 'var(--space-2) 0',
                }}
              >
                <span>EV charging savings/year</span>
                <span>{chargingSavings.toLocaleString('sv-SE')} kr</span>
              </div>
            )}
          </div>
        </div>

        {/* Cumulative savings bar chart */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 var(--space-6) 0' }}>Cumulative savings</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', height: '160px' }}>
            {barYears.map((year) => {
              const cumulative = annualSavings * year - netCost
              const height = Math.max(4, ((annualSavings * year) / maxCumulative) * 100)
              const isPositive = cumulative > 0
              return (
                <div key={year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 500, color: isPositive ? 'var(--color-accent)' : 'var(--color-gray-500)', marginBottom: 'var(--space-1)' }}>
                    {cumulative > 0 ? '+' : ''}{Math.round(cumulative / 1000)}k
                  </span>
                  <div
                    style={{
                      width: '100%',
                      height: `${height}%`,
                      background: isPositive ? 'var(--color-accent)' : 'var(--color-gray-300)',
                      minHeight: '4px',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-primary)', fontSize: '10px', color: 'var(--color-gray-500)', marginTop: 'var(--space-1)' }}>Year {year}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Comparison columns */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 var(--space-6) 0' }}>Annual electricity cost</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {[
              { label: 'Without solar', value: `${annualCostWithout.toLocaleString('sv-SE')} kr`, accent: false },
              { label: 'With solar', value: `${annualCostWith.toLocaleString('sv-SE')} kr`, accent: false },
              { label: 'With solar + battery', value: `${annualCostWithBattery.toLocaleString('sv-SE')} kr`, accent: true },
            ].map((col, i) => (
              <div
                key={col.label}
                className="stagger-item"
                style={{
                  borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
                  paddingLeft: i === 0 ? 0 : 'var(--space-6)',
                  paddingRight: 'var(--space-6)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: col.accent ? 'var(--color-accent)' : 'var(--color-black)', display: 'block' }}>
                  {col.value}
                </span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', display: 'block', marginTop: 'var(--space-1)' }}>
                  {col.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; gap: var(--space-6) !important; }
          section > div > div[style*="grid-template-columns: repeat(3"] > div { border-left: 2px solid var(--color-gray-200) !important; padding-left: var(--space-6) !important; }
          section > div:first-child > div[style*="gap"] { flex-direction: column !important; }
        }
      `}</style>
    </section>
  )
}
