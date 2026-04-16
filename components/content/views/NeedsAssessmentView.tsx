'use client'

interface Answers {
  boendetyp?: string
  arsforbrukning?: string
  elbil?: string
  hemma_dagtid?: string
  eluppvarmning?: string
}

interface Estimate {
  area?: string
  currentMonthlyCost?: number
  solarSaving?: number
  batterySaving?: number
  newMonthlyCost?: number
  equipmentMonthlyCost?: number
  netResult?: number
}

interface NeedsAssessmentData {
  step?: number
  blocked?: boolean
  answers?: Answers
  estimate?: Estimate
}

const areaLabel: Record<string, string> = {
  SE1: 'Norrbotten',
  SE2: 'Sundsvall',
  SE3: 'Stockholm',
  SE4: 'Malmö',
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AnswerRow({ label, value, options }: { label: string; value?: string; options: string[] }) {
  const hasValue = !!value
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', padding: 'var(--space-2) 0' }}>
      <div style={{ width: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {hasValue && <CheckIcon />}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-sm)',
          fontWeight: 600,
          color: hasValue ? 'var(--color-black)' : 'var(--color-gray-400)',
          minWidth: '140px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-sm)',
          fontWeight: hasValue ? 600 : 400,
          color: hasValue ? 'var(--color-accent)' : 'var(--color-gray-400)',
        }}
      >
        {hasValue ? value : options.join(' / ')}
      </span>
    </div>
  )
}

function EstimateRow({ label, value, highlight, negative }: { label: string; value: string; highlight?: boolean; negative?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: highlight ? 'var(--space-4) 0' : 'var(--space-2) 0',
        borderTop: highlight ? '2px solid var(--color-black)' : 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: highlight ? 'var(--type-heading-sm)' : 'var(--type-body-sm)',
          fontWeight: highlight ? 700 : 400,
          color: 'var(--color-black)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: highlight ? 'var(--type-heading-md)' : 'var(--type-body-sm)',
          fontWeight: highlight ? 700 : 600,
          color: negative ? 'var(--color-accent)' : 'var(--color-black)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export function NeedsAssessmentView({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as NeedsAssessmentData
  const currentStep = d?.step || 1
  const blocked = d?.blocked || false
  const answers = d?.answers || {}
  const estimate = d?.estimate

  const stepLabels = [
    { num: '01', title: 'Housing type' },
    { num: '02', title: 'Energy profile' },
    { num: '03', title: 'Savings' },
  ]

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      {/* Header */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-display-sm)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--color-black)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Needs Assessment
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-md)',
            color: 'var(--color-gray-700)',
            lineHeight: 1.5,
            margin: 0,
            maxWidth: '55ch',
          }}
        >
          We analyze your situation based on our conversation. Everything you share in the chat automatically fills in the analysis.
        </p>
      </div>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        {stepLabels.map((s, i) => {
          const isActive = i + 1 === currentStep
          const isCompleted = i + 1 < currentStep
          const isBlocked = blocked && i > 0
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {i > 0 && (
                <div
                  style={{
                    width: 24,
                    height: 1,
                    background: isCompleted ? 'var(--color-black)' : 'var(--color-gray-300)',
                  }}
                />
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  opacity: isBlocked ? 0.3 : isActive || isCompleted ? 1 : 0.4,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-xs)',
                    fontWeight: 700,
                    color: isActive ? 'var(--color-accent)' : isCompleted ? 'var(--color-black)' : 'var(--color-gray-400)',
                    background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
                    borderRadius: 4,
                    padding: '2px 6px',
                  }}
                >
                  {s.num}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive || isCompleted ? 'var(--color-black)' : 'var(--color-gray-400)',
                  }}
                >
                  {s.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Step 1: Boendetyp */}
      <div style={{ opacity: currentStep >= 1 ? 1 : 0.4 }}>
        <h3
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Can you install?
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {['House', 'Townhouse', 'Apartment'].map((opt) => {
            const key = opt.toLowerCase()
            const isSelected = answers.boendetyp?.toLowerCase() === key || answers.boendetyp === opt.toLowerCase()
            return (
              <div
                key={opt}
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: isSelected ? 700 : 400,
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-gray-600)',
                  background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-gray-100)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 6,
                  border: isSelected ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                {isSelected && <CheckIcon />}
                {opt}
              </div>
            )
          })}
        </div>
      </div>

      {/* Blocked message for lägenhet */}
      {blocked && (
        <div
          style={{
            background: 'var(--color-gray-100)',
            borderRadius: 8,
            padding: 'var(--space-6)',
            borderLeft: '3px solid var(--color-gray-400)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-md)',
              color: 'var(--color-gray-700)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Unfortunately, solar panels and batteries are normally not possible in an apartment. But we can help you save in other ways &mdash; feel free to ask in the chat!
          </p>
        </div>
      )}

      {/* Step 2: Energiprofil */}
      {!blocked && (
        <div style={{ opacity: currentStep >= 2 ? 1 : 0.35 }}>
          <h3
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-heading-sm)',
              fontWeight: 700,
              color: 'var(--color-black)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            How do you use electricity?
          </h3>
          <div
            style={{
              background: 'var(--color-gray-50)',
              borderRadius: 8,
              padding: 'var(--space-4) var(--space-5)',
            }}
          >
            <AnswerRow
              label="Annual consumption"
              value={answers.arsforbrukning ? ({ lag: 'Low (< 10,000 kWh)', normal: 'Normal (10-20,000 kWh)', hog: 'High (> 20,000 kWh)', låg: 'Low (< 10,000 kWh)', hög: 'High (> 20,000 kWh)' }[answers.arsforbrukning] || answers.arsforbrukning) : undefined}
              options={['Low', 'Normal', 'High']}
            />
            <AnswerRow
              label="EV / charging"
              value={answers.elbil ? ({ ja: 'Yes', nej: 'No', planerar: 'Planning' }[answers.elbil] || answers.elbil) : undefined}
              options={['Yes', 'No', 'Planning']}
            />
            <AnswerRow
              label="Home during daytime"
              value={answers.hemma_dagtid ? ({ ofta: 'Often', sällan: 'Rarely' }[answers.hemma_dagtid] || answers.hemma_dagtid) : undefined}
              options={['Often', 'Rarely']}
            />
            <AnswerRow
              label="Electric heating"
              value={answers.eluppvarmning ? ({ ja: 'Yes', nej: 'No' }[answers.eluppvarmning] || answers.eluppvarmning) : undefined}
              options={['Yes', 'No']}
            />
          </div>
          {currentStep === 2 && (
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-xs)',
                color: 'var(--color-gray-500)',
                margin: 'var(--space-3) 0 0 0',
              }}
            >
              Tell us in the chat and we will fill it in automatically.
            </p>
          )}
        </div>
      )}

      {/* Step 3: Uppskattad besparing */}
      {!blocked && (
        <div style={{ opacity: currentStep >= 3 && estimate ? 1 : 0.35 }}>
          <h3
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-heading-sm)',
              fontWeight: 700,
              color: 'var(--color-black)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            What can you save?
          </h3>
          {estimate ? (
            <div
              style={{
                background: 'var(--color-gray-50)',
                borderRadius: 8,
                padding: 'var(--space-5) var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
              }}
            >
              {estimate.area && (
                <p
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-xs)',
                    color: 'var(--color-gray-500)',
                    margin: '0 0 var(--space-3) 0',
                  }}
                >
                  Price area: {estimate.area} ({areaLabel[estimate.area] || estimate.area})
                </p>
              )}
              <EstimateRow label="Current monthly cost" value={`${(estimate.currentMonthlyCost ?? 0).toLocaleString('sv-SE')} kr`} />
              <EstimateRow label="Solar panel savings" value={`−${(estimate.solarSaving ?? 0).toLocaleString('sv-SE')} kr`} negative />
              <EstimateRow label="Battery savings" value={`−${(estimate.batterySaving ?? 0).toLocaleString('sv-SE')} kr`} negative />
              <EstimateRow label="New monthly cost" value={`${(estimate.newMonthlyCost ?? 0).toLocaleString('sv-SE')} kr`} />
              <EstimateRow label="Equipment (Energai Flex)" value={`${(estimate.equipmentMonthlyCost ?? 0).toLocaleString('sv-SE')} kr/mo`} />
              <EstimateRow
                label="Net result"
                value={
                  (estimate.netResult ?? 0) > 0
                    ? `You save ${(estimate.netResult ?? 0).toLocaleString('sv-SE')} kr/mo`
                    : (estimate.netResult ?? 0) === 0
                      ? 'Breaks even'
                      : `Costs ${Math.abs(estimate.netResult ?? 0).toLocaleString('sv-SE')} kr/mo more`
                }
                highlight
                negative={(estimate.netResult ?? 0) > 0}
              />
            </div>
          ) : (
            <div
              style={{
                background: 'var(--color-gray-50)',
                borderRadius: 8,
                padding: 'var(--space-6)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  color: 'var(--color-gray-400)',
                  margin: 0,
                }}
              >
                We will calculate your savings when we have enough information.
              </p>
            </div>
          )}
        </div>
      )}

      <p
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-xs)',
          color: 'var(--color-gray-400)',
          margin: 0,
        }}
      >
        All information is gathered from our chat dialogue. You don't need to fill in anything manually.
      </p>
    </section>
  )
}
