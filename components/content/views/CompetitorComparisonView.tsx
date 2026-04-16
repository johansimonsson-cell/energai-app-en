'use client'

/* ------------------------------------------------------------------ */
/*  Typer                                                             */
/* ------------------------------------------------------------------ */

interface LineItem {
  name: string
  price: number
}

interface FinancingOption {
  type: string
  amount?: number
  years?: number
  rate?: number
  monthlyPayment?: number
}

interface CompetitorData {
  name?: string
  offerNumber?: string
  validUntil?: string
  system?: {
    solarPanels?: string
    solarKwp?: number
    battery?: string
    batteryKwh?: number
    inverter?: string
    inverterKw?: number
    estimatedAnnualProduction?: number
  }
  pricing?: {
    totalBeforeDeductions?: number
    greenDeduction?: number
    totalAfterDeductions?: number
    lineItems?: LineItem[]
  }
  electricity?: {
    type?: string
    pricePerKwh?: number
    monthlyFee?: number
    bindingYears?: number
  }
  financing?: FinancingOption[]
  warranty?: Record<string, string>
  flags?: string[]
}

interface EnergaiData {
  system?: {
    solarKwp?: number
    batteryKwh?: number
  }
  pricing?: {
    options?: { years: number; monthlyTotal: number }[]
    bundleDiscount?: number
  }
  electricity?: {
    type?: string
    marginPerKwh?: number
    monthlyFee?: number
    bindingYears?: number
  }
  included?: string[]
}

interface Argument {
  title: string
  description: string
}

interface ComparisonData {
  totalCost10yr?: { competitor: number; energai: number }
  arguments?: Argument[]
}

interface ViewData {
  phase?: number
  competitor?: CompetitorData
  energai?: EnergaiData
  comparison?: ComparisonData
}

/* ------------------------------------------------------------------ */
/*  Hjälpkomponenter                                                  */
/* ------------------------------------------------------------------ */

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--type-body-xs)',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: 'var(--color-gray-400)',
        display: 'block',
        marginBottom: 'var(--space-3)',
      }}
    >
      {children}
    </span>
  )
}

function kr(n: number | undefined) {
  if (n == null) return '—'
  return n.toLocaleString('sv-SE') + ' kr'
}

/* ------------------------------------------------------------------ */
/*  Fas 1 — Konkurrentens offert                                      */
/* ------------------------------------------------------------------ */

function Phase1({ competitor }: { competitor: CompetitorData }) {
  const sys = competitor.system
  const pricing = competitor.pricing
  const elec = competitor.electricity
  const fin = competitor.financing

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-lg)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--color-black)',
            margin: '0 0 var(--space-2) 0',
          }}
        >
          Quote from {competitor.name || 'Competitor'}
        </h2>
        {competitor.offerNumber && (
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', color: 'var(--color-gray-500)', margin: 0 }}>
            {competitor.offerNumber}{competitor.validUntil ? ` — valid until ${competitor.validUntil}` : ''}
          </p>
        )}
      </div>

      {/* System */}
      {sys && (
        <div>
          <SectionLabel>System</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {sys.solarPanels && (
              <Row label="Solar panels" value={`${sys.solarPanels}${sys.solarKwp ? ` (${sys.solarKwp} kWp)` : ''}`} />
            )}
            {sys.battery && (
              <Row label="Battery" value={`${sys.battery}${sys.batteryKwh ? ` ${sys.batteryKwh} kWh` : ''}`} />
            )}
            {sys.inverter && (
              <Row label="Inverter" value={`${sys.inverter}${sys.inverterKw ? ` ${sys.inverterKw} kW` : ''}`} />
            )}
            {sys.estimatedAnnualProduction && (
              <Row label="Est. annual production" value={`${sys.estimatedAnnualProduction.toLocaleString('sv-SE')} kWh`} />
            )}
          </div>
        </div>
      )}

      {/* Pris */}
      {pricing && (
        <div>
          <SectionLabel>Price</SectionLabel>
          {pricing.lineItems && pricing.lineItems.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
              {pricing.lineItems.map((item, i) => (
                <Row key={i} label={item.name} value={kr(item.price)} light />
              ))}
            </div>
          )}
          <div
            style={{
              borderTop: '1px solid var(--color-gray-200)',
              paddingTop: 'var(--space-2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
            }}
          >
            {pricing.totalBeforeDeductions != null && (
              <Row label="Total price" value={kr(pricing.totalBeforeDeductions)} />
            )}
            {pricing.greenDeduction != null && pricing.greenDeduction > 0 && (
              <Row label="Green deduction" value={`\u2212 ${kr(pricing.greenDeduction)}`} accent />
            )}
            {pricing.totalAfterDeductions != null && (
              <Row label="Amount to pay" value={kr(pricing.totalAfterDeductions)} bold />
            )}
          </div>
        </div>
      )}

      {/* Elavtal */}
      {elec && (
        <div>
          <SectionLabel>Electricity contract</SectionLabel>
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', margin: 0, lineHeight: 1.6 }}>
            {elec.type === 'fixed' ? 'Fixed price' : 'Variable price'}:{' '}
            {elec.pricePerKwh != null ? `${(elec.pricePerKwh * 100).toFixed(0)} &ouml;re/kWh` : '—'}
            {elec.monthlyFee != null ? `, ${elec.monthlyFee} kr/m&aring;n` : ''}
            {elec.bindingYears ? `, ${elec.bindingYears} year binding` : ''}
          </p>
        </div>
      )}

      {/* Finansiering */}
      {fin && fin.length > 0 && (
        <div>
          <SectionLabel>Financing</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {fin.map((f, i) => (
              <Row
                key={i}
                label={f.type === 'cash' ? 'Cash' : `Loan ${f.years} yrs (${f.rate}%)`}
                value={f.type === 'cash' ? kr(f.amount) : `${kr(f.monthlyPayment)}/m&aring;n`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Flaggor / varningar */}
      {competitor.flags && competitor.flags.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {competitor.flags.map((flag, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-2)',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-xs)',
                color: 'var(--color-gray-600)',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: 'var(--color-gray-400)', flexShrink: 0 }}>&#9888;</span>
              {flag}
            </div>
          ))}
        </div>
      )}

      {/* Bekräftelse */}
      <div
        style={{
          background: 'var(--color-gray-50)',
          borderRadius: 8,
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <CheckIcon size={16} />
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)' }}>
          Verified by AI &mdash; does this match your quote?
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Fas 2 — Energai Flex-motsvarighet                                  */
/* ------------------------------------------------------------------ */

function Phase2({ energai }: { energai: EnergaiData }) {
  const sys = energai.system
  const pricing = energai.pricing

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'var(--color-accent)', margin: '0 0 var(--space-2) 0' }}>
          Energai Flex
        </p>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-black)', margin: 0 }}>
          Your matching solution
        </h2>
      </div>

      {/* System */}
      {sys && (
        <div>
          <SectionLabel>System</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {sys.solarKwp != null && <Row label="Solar panels" value={`${sys.solarKwp} kWp`} />}
            {sys.batteryKwh != null && <Row label="Battery" value={`${sys.batteryKwh} kWh`} />}
            <Row label="Inverter" value="Included" />
          </div>
        </div>
      )}

      {/* Månadskostnad per bindningstid */}
      {pricing?.options && pricing.options.length > 0 && (
        <div>
          <SectionLabel>Monthly cost</SectionLabel>
          {pricing.bundleDiscount != null && pricing.bundleDiscount > 0 && (
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', color: 'var(--color-accent)', margin: '0 0 var(--space-3) 0' }}>
              Package discount &minus;{pricing.bundleDiscount}% on the fixed part included
            </p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {pricing.options.map((opt) => (
              <div
                key={opt.years}
                style={{
                  flex: 1,
                  background: 'var(--color-gray-50)',
                  borderRadius: 8,
                  padding: 'var(--space-4)',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', color: 'var(--color-gray-500)', display: 'block', marginBottom: 'var(--space-2)' }}>
                  {opt.years} &aring;r
                </span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, color: 'var(--color-black)' }}>
                  {opt.monthlyTotal.toLocaleString('sv-SE')} kr
                </span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', color: 'var(--color-gray-500)', display: 'block' }}>/m&aring;n</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Elavtal */}
      {energai.electricity && (
        <div>
          <SectionLabel>Electricity contract</SectionLabel>
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', margin: 0, lineHeight: 1.6 }}>
            Spot price + {((energai.electricity.marginPerKwh ?? 0.10) * 100).toFixed(0)} öre/kWh, {energai.electricity.monthlyFee ?? 39} kr/mo, no binding
          </p>
        </div>
      )}

      {/* Fördelar */}
      {energai.included && energai.included.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {energai.included.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <CheckIcon />
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-black)' }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Fas 3 — Sida vid sida                                             */
/* ------------------------------------------------------------------ */

function Phase3({ competitor, energai, comparison }: { competitor: CompetitorData; energai: EnergaiData; comparison: ComparisonData }) {
  const compName = competitor.name || 'Competitor'
  const tenYr = comparison.totalCost10yr
  const args = comparison.arguments || []

  // Beräkna procentuell bredd för stapeldiagram
  const maxCost = tenYr ? Math.max(tenYr.competitor, tenYr.energai) : 1
  const compPct = tenYr ? (tenYr.competitor / maxCost) * 100 : 50
  const energaiPct = tenYr ? (tenYr.energai / maxCost) * 100 : 50

  // Hitta 10-årsalternativet
  const tenYearOption = energai.pricing?.options?.find(o => o.years === 10)

  // Jämförelserader
  const rows: { label: string; comp: string; enrg: string; energaiWins?: boolean }[] = [
    {
      label: 'Down payment',
      comp: kr(competitor.pricing?.totalAfterDeductions),
      enrg: '0 kr',
      energaiWins: true,
    },
    {
      label: 'Monthly cost (10 yrs)',
      comp: competitor.financing?.find(f => f.type === 'loan' && f.years === 10)
        ? `${kr(competitor.financing.find(f => f.type === 'loan' && f.years === 10)!.monthlyPayment)}/m\u00e5n`
        : '0 kr*',
      enrg: tenYearOption ? `${kr(tenYearOption.monthlyTotal)}/m\u00e5n` : '\u2014',
    },
    {
      label: 'Electricity price',
      comp: competitor.electricity?.pricePerKwh != null
        ? `${(competitor.electricity.pricePerKwh * 100).toFixed(0)} \u00f6re/kWh ${competitor.electricity.type === 'fixed' ? '(fixed)' : '(variable)'}`
        : '\u2014',
      enrg: `Spot + ${((energai.electricity?.marginPerKwh ?? 0.10) * 100).toFixed(0)} \u00f6re/kWh`,
    },
    {
      label: 'Contract binding',
      comp: competitor.electricity?.bindingYears ? `${competitor.electricity.bindingYears} \u00e5r` : '\u2014',
      enrg: 'None',
      energaiWins: (competitor.electricity?.bindingYears ?? 0) > 0,
    },
    {
      label: 'Installation',
      comp: 'Included',
      enrg: 'Included',
    },
    {
      label: 'Ownership',
      comp: 'Immediate',
      enrg: 'After binding period',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-black)', margin: 0 }}>
        Comparison
      </h2>

      {/* Tabell */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontWeight: 500, color: 'var(--color-gray-500)', padding: 'var(--space-3) var(--space-4) var(--space-3) 0', borderBottom: '1px solid var(--color-gray-200)' }}> </th>
              <th style={{ textAlign: 'left', fontWeight: 500, color: 'var(--color-gray-500)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-200)', borderLeft: '2px solid var(--color-gray-200)' }}>
                {compName}
              </th>
              <th style={{ textAlign: 'left', fontWeight: 700, color: 'var(--color-black)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-200)', borderLeft: '2px solid var(--color-gray-200)' }}>
                Energai Flex
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td style={{ fontWeight: 400, color: 'var(--color-gray-700)', padding: 'var(--space-3) var(--space-4) var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                  {row.label}
                </td>
                <td style={{ fontWeight: 400, color: 'var(--color-gray-500)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', borderLeft: '2px solid var(--color-gray-200)' }}>
                  {row.comp}
                </td>
                <td style={{ fontWeight: 500, color: row.energaiWins ? 'var(--color-accent)' : 'var(--color-black)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', borderLeft: '2px solid var(--color-gray-200)' }}>
                  {row.enrg}{row.energaiWins ? ' \u2713' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 10-årsdiagram */}
      {tenYr && (
        <div>
          <SectionLabel>True cost over 10 years</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Konkurrent */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', color: 'var(--color-gray-600)' }}>{compName}</span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--color-gray-700)' }}>{kr(tenYr.competitor)}</span>
              </div>
              <div style={{ height: 28, background: 'var(--color-gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${compPct}%`, background: 'var(--color-gray-400)', borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
            </div>
            {/* Energai */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', color: 'var(--color-gray-600)' }}>Energai Flex (10 &aring;r)</span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--color-accent)' }}>{kr(tenYr.energai)}</span>
              </div>
              <div style={{ height: 28, background: 'var(--color-gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${energaiPct}%`, background: 'var(--color-accent)', borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
            </div>
            {tenYr.competitor > tenYr.energai && (
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-xs)', color: 'var(--color-accent)', margin: 0, fontWeight: 600 }}>
                You save {kr(tenYr.competitor - tenYr.energai)} over 10 years with Energai
              </p>
            )}
          </div>
        </div>
      )}

      {/* Argument */}
      {args.length > 0 && (
        <div>
          <SectionLabel>Why Energai</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {args.map((arg, i) => (
              <div key={i} style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: 'var(--space-4)' }}>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--color-black)', display: 'block', marginBottom: 'var(--space-1)' }}>
                  {i + 1}. {arg.title}
                </span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', lineHeight: 1.5 }}>
                  {arg.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hjälprad                                                           */
/* ------------------------------------------------------------------ */

function Row({ label, value, bold, accent, light }: { label: string; value: string; bold?: boolean; accent?: boolean; light?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: 'var(--space-1) 0' }}>
      <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: light ? 'var(--color-gray-500)' : 'var(--color-gray-700)' }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-sm)',
          fontWeight: bold ? 700 : 500,
          color: accent ? 'var(--color-accent)' : 'var(--color-black)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Fallback — statisk vy (ingen data.phase)                          */
/* ------------------------------------------------------------------ */

const fallbackRows = [
  { feature: 'Price (10 kW)', energai: 'From 1,100 kr/mo', market: '130,000\u2013180,000 kr cash' },
  { feature: 'Down payment', energai: '0 kr', market: 'Full amount' },
  { feature: 'Installation incl.', energai: true, market: 'Varies' },
  { feature: 'Panel warranty', energai: '25 years', market: '10\u201325 years' },
  { feature: 'Smart control', energai: true, market: false },
  { feature: 'Ecosystem (electricity+solar+battery+charger)', energai: true, market: false },
  { feature: 'Single point of contact', energai: true, market: false },
]

function FallbackView({ competitors, product }: { competitors: string[]; product: string }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-black)', margin: '0 0 var(--space-3) 0' }}>
          How we compare
        </h2>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>
          Comparison for {product} against the market average{competitors.length > 0 ? ` (incl. ${competitors.join(', ')})` : ''}.
        </p>
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontWeight: 500, color: 'var(--color-gray-500)', padding: 'var(--space-3) var(--space-4) var(--space-3) 0', borderBottom: '1px solid var(--color-gray-200)' }}>Feature</th>
              <th style={{ textAlign: 'left', fontWeight: 700, color: 'var(--color-black)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-200)', borderLeft: '2px solid var(--color-gray-200)' }}>Energai Flex</th>
              <th style={{ textAlign: 'left', fontWeight: 500, color: 'var(--color-gray-500)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-200)', borderLeft: '2px solid var(--color-gray-200)' }}>Market average</th>
            </tr>
          </thead>
          <tbody>
            {fallbackRows.map((row) => (
              <tr key={row.feature}>
                <td style={{ fontWeight: 400, color: 'var(--color-gray-700)', padding: 'var(--space-3) var(--space-4) var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>{row.feature}</td>
                <td style={{ fontWeight: 500, color: 'var(--color-black)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', borderLeft: '2px solid var(--color-gray-200)' }}>
                  {typeof row.energai === 'boolean' ? (row.energai ? <CheckIcon /> : '\u2014') : row.energai}
                </td>
                <td style={{ fontWeight: 400, color: 'var(--color-gray-500)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', borderLeft: '2px solid var(--color-gray-200)' }}>
                  {typeof row.market === 'boolean' ? (row.market ? <CheckIcon /> : <span style={{ color: 'var(--color-gray-400)' }}>\u2014</span>) : row.market}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: 'var(--space-6)' }}>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, color: 'var(--color-black)', lineHeight: 1.5, margin: 0 }}>
          Do you have a quote from a competitor? Upload it in the chat and we will do a detailed comparison.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export function CompetitorComparisonView({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as ViewData
  const phase = d?.phase

  // Om ingen phase — visa fallback (bakåtkompatibel)
  if (!phase) {
    const competitors = (data?.competitors as string[]) || []
    const product = (data?.product as string) || 'Solar panels'
    return <FallbackView competitors={competitors} product={product} />
  }

  const competitor = d.competitor || {}
  const energai = d.energai || {}
  const comparison = d.comparison || {}

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      {/* Phase tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: 'var(--space-1)' }}>
        {[
          { num: 1, label: 'Quote' },
          { num: 2, label: 'Energai Flex' },
          { num: 3, label: 'Comparison' },
        ].map((tab) => (
          <span
            key={tab.num}
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-xs)',
              fontWeight: tab.num === phase ? 700 : 400,
              color: tab.num === phase ? 'var(--color-black)' : tab.num < phase ? 'var(--color-gray-600)' : 'var(--color-gray-400)',
              padding: 'var(--space-2) var(--space-4)',
              borderBottom: tab.num === phase ? '2px solid var(--color-black)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab.num}. {tab.label}
          </span>
        ))}
      </div>

      {/* Active phase */}
      {phase === 1 && <Phase1 competitor={competitor} />}
      {phase === 2 && <Phase2 energai={energai} />}
      {phase === 3 && <Phase3 competitor={competitor} energai={energai} comparison={comparison} />}

      <style>{`
        @media (max-width: 767px) {
          table { font-size: 12px !important; }
          th, td { padding: var(--space-2) var(--space-3) !important; }
        }
      `}</style>
    </section>
  )
}
