'use client'

export function ConfirmationView({ data }: { data: Record<string, unknown> }) {
  const planName = (data?.planName as string) || 'Variable rate'
  const email = (data?.email as string) || ''
  const agreementNumber = `EA-${Date.now().toString(36).toUpperCase()}`

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'clamp(36px, 5vw, var(--type-display-md))',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.01em',
          color: 'var(--color-white)',
          margin: '0 0 var(--space-6) 0',
        }}
      >
        Welcome to
        <br />
        Energai
      </h2>

      <p
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-heading-lg)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.005em',
          color: 'var(--color-accent)',
          margin: '0 0 var(--space-10) 0',
        }}
      >
        {agreementNumber}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
          marginBottom: 'var(--space-12)',
        }}
      >
        {[
          { label: 'Plan', value: planName },
          { label: 'Status', value: 'Activating within 24h' },
          { label: 'Confirmation sent to', value: email },
        ].map((item, i) => (
          <div
            key={item.label}
            className="stagger-item"
            style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-700)',
              paddingLeft: i === 0 ? '0' : 'var(--space-6)',
              paddingRight: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-label-lg)',
                fontWeight: 500,
                color: 'var(--color-gray-500)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 500,
                lineHeight: 1.4,
                color: 'var(--color-white)',
                wordBreak: 'break-word',
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div>
        <h3
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-white)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Next steps
        </h3>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          {[
            'We will activate your plan within 24 hours.',
            'A confirmation will be sent to your email.',
            'You can now log in to My pages via the chat.',
            'Have questions? Write in the chat and we will help you.',
          ].map((text) => (
            <li
              key={text}
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                style={{ marginTop: '4px', flexShrink: 0 }}
              >
                <path d="M2 6L5 9L10 3" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: var(--space-6) !important;
          }
          section > div[style*="grid-template-columns"] > div {
            border-left: 2px solid var(--color-gray-700) !important;
            padding-left: var(--space-6) !important;
          }
        }
      `}</style>
    </section>
  )
}
