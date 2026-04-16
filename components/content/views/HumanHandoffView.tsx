'use client'

const timeSlots = [
  'Select time',
  'Morning (8–10)',
  'Late morning (10–12)',
  'Lunch (12–13)',
  'Afternoon (13–15)',
  'Late afternoon (15–17)',
]

export function HumanHandoffView({ data }: { data: Record<string, unknown> }) {
  const conversationSummary = (data?.conversationSummary as string) || ''
  const identifiedNeeds = (data?.identifiedNeeds as string[]) || []

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* DARK upper section */}
      <div
        style={{
          background: 'var(--color-black)',
          padding: 'var(--space-12) var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-display-sm)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--color-white)',
            margin: 0,
          }}
        >
          We are connecting you
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-lg)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
            margin: 0,
            maxWidth: '50ch',
          }}
        >
          An energy advisor will contact you within 2 hours
        </p>
      </div>

      {/* LIGHT lower section */}
      <div
        style={{
          background: 'var(--color-gray-25)',
          padding: 'var(--space-10) var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-10)',
        }}
      >
        {/* Conversation summary */}
        {conversationSummary && (
          <div
            style={{
              borderLeft: '2px solid var(--color-gray-200)',
              paddingLeft: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 500,
                color: 'var(--color-gray-500)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Conversation summary
            </span>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                color: 'var(--color-gray-700)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '60ch',
              }}
            >
              {conversationSummary}
            </p>
            {identifiedNeeds.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', flexWrap: 'wrap' as const }}>
                {identifiedNeeds.map((need) => (
                  <span
                    key={need}
                    style={{
                      fontFamily: 'var(--font-primary)',
                      fontSize: 'var(--type-body-sm)',
                      fontWeight: 500,
                      color: 'var(--color-black)',
                      padding: 'var(--space-1) var(--space-3)',
                      border: '1px solid var(--color-gray-200)',
                      background: 'var(--color-white)',
                    }}
                  >
                    {need}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact options - 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {/* Call us */}
          <div
            className="stagger-item"
            style={{
              paddingRight: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-heading-sm)',
                fontWeight: 700,
                color: 'var(--color-black)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Call us
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-heading-md)',
                fontWeight: 700,
                color: 'var(--color-black)',
                marginBottom: 'var(--space-2)',
              }}
            >
              08-123 456 78
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                color: 'var(--color-gray-500)',
              }}
            >
              Mon–Fri 8–17
            </span>
          </div>

          {/* Callback */}
          <div
            className="stagger-item"
            style={{
              borderLeft: '2px solid var(--color-gray-200)',
              paddingLeft: 'var(--space-6)',
              paddingRight: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-heading-sm)',
                fontWeight: 700,
                color: 'var(--color-black)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Callback
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 500,
                    color: 'var(--color-gray-500)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    color: 'var(--color-black)',
                    width: '100%',
                    padding: 'var(--space-2) 0',
                    border: 'none',
                    borderBottom: '1px solid var(--color-gray-300)',
                    background: 'transparent',
                    outline: 'none',
                    borderRadius: '0',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 500,
                    color: 'var(--color-gray-500)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="07X-XXX XX XX"
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    color: 'var(--color-black)',
                    width: '100%',
                    padding: 'var(--space-2) 0',
                    border: 'none',
                    borderBottom: '1px solid var(--color-gray-300)',
                    background: 'transparent',
                    outline: 'none',
                    borderRadius: '0',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 500,
                    color: 'var(--color-gray-500)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  Preferred time
                </label>
                <select
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    color: 'var(--color-black)',
                    width: '100%',
                    padding: 'var(--space-2) 0',
                    border: 'none',
                    borderBottom: '1px solid var(--color-gray-300)',
                    background: 'transparent',
                    outline: 'none',
                    borderRadius: '0',
                    appearance: 'none' as const,
                    WebkitAppearance: 'none' as const,
                  }}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Email */}
          <div
            className="stagger-item"
            style={{
              borderLeft: '2px solid var(--color-gray-200)',
              paddingLeft: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-heading-sm)',
                fontWeight: 700,
                color: 'var(--color-black)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Email
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-md)',
                fontWeight: 500,
                color: 'var(--color-black)',
                marginBottom: 'var(--space-2)',
              }}
            >
              kontakt@energai.se
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                color: 'var(--color-gray-500)',
                lineHeight: 1.5,
              }}
            >
              We reply within 24 hours
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div:last-child > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
            gap: var(--space-8) !important;
          }
          section > div:last-child > div[style*="grid-template-columns: repeat(3"] > div {
            border-left: 2px solid var(--color-gray-200) !important;
            padding-left: var(--space-6) !important;
          }
        }
      `}</style>
    </section>
  )
}
