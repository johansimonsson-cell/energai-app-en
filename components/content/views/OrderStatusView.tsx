'use client'

const orderSteps = ['Quote', 'Confirmed', 'Scheduled', 'Installation', 'Completed']

export function OrderStatusView({ data }: { data: Record<string, unknown> }) {
  const currentStep = 2 // 0-indexed: Schemalagd
  const orderId = (data.orderId as string) || 'ORD-2026-0042'

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>
          Order status
        </h2>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)' }}>
          {orderId}
        </span>
      </div>

      {/* Horizontal step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {orderSteps.map((step, i) => {
          const isActive = i === currentStep
          const isCompleted = i < currentStep
          const isFuture = i > currentStep
          return (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < orderSteps.length - 1 ? 1 : 'none' }}>
              {/* Step circle */}
              <div style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: isCompleted || isActive ? 'var(--color-black)' : 'transparent',
                border: isFuture ? '1.5px solid var(--color-gray-300)' : 'none',
              }}>
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="square" /></svg>
                ) : (
                  <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', fontWeight: 700, color: isActive ? 'var(--color-white)' : 'var(--color-gray-400)' }}>
                    {i + 1}
                  </span>
                )}
              </div>
              {/* Label */}
              <span style={{
                fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--color-black)' : isFuture ? 'var(--color-gray-400)' : 'var(--color-gray-600)',
                marginLeft: 'var(--space-2)', whiteSpace: 'nowrap',
              }}>
                {step}
              </span>
              {/* Connector line */}
              {i < orderSteps.length - 1 && (
                <div style={{ flex: 1, height: '1.5px', background: isCompleted ? 'var(--color-black)' : 'var(--color-gray-200)', margin: '0 var(--space-3)' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Order details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          { label: 'Product', value: 'Solar panels 10 kW' },
          { label: 'Installation date', value: 'May 15, 2026' },
          { label: 'Installer', value: 'SolTech Partner AB' },
        ].map((item, i) => (
          <div key={item.label} style={{ borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)', paddingLeft: i === 0 ? 0 : 'var(--space-6)', paddingRight: 'var(--space-6)' }}>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, display: 'block' }}>{item.value}</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', color: 'var(--color-gray-600)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>Price summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '400px' }}>
          {[
            { label: 'Total price', value: '129 000 kr' },
            { label: 'ROT deduction', value: '-15 000 kr' },
            { label: 'Green deduction', value: '-25 800 kr' },
            { label: 'Net price', value: '88 200 kr', bold: true },
            { label: 'Monthly payment (60 mo)', value: '1 645 kr/mo' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-100)', padding: 'var(--space-2) 0' }}>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)' }}>{row.label}</span>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: row.bold ? 700 : 500 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>Documents</h3>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          {['Quote PDF', 'Contract', 'Invoice'].map(doc => (
            <button key={doc} style={{ background: 'transparent', color: 'var(--color-black)', border: '1.5px solid var(--color-black)', padding: '10px 20px', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: 'pointer', minHeight: '44px' }}>
              {doc}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
