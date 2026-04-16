'use client'

import { useState } from 'react'

const faqItems = [
  {
    question: 'How do I switch electricity plans?',
    answer: 'Write in the chat that you want to switch plans and we will help you. You can also go to Settings to see your options.',
  },
  {
    question: 'Why is my invoice higher than usual?',
    answer: 'The invoice amount depends on your consumption and the current electricity price. Check your usage history to see if your consumption has increased.',
  },
  {
    question: 'What happens during a power outage?',
    answer: 'During a power outage, contact your local grid operator. Energai delivers the electricity, but the grid is owned by your network company.',
  },
  {
    question: 'How do I cancel my contract?',
    answer: 'Go to Settings and click "Cancel contract". The notice period is 14 days for variable rate and 1 month for fixed price.',
  },
]

export function SupportView({ data }: { data: Record<string, unknown> }) {
  const escalate = data?.escalate as boolean | undefined
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !description) return
    setSubmitted(true)
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-start',
        paddingTop: 'var(--space-10)',
        gap: 'var(--space-10)',
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-heading-lg)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.005em',
          color: 'var(--color-black)',
          margin: 0,
        }}
      >
        Support
      </h2>

      {/* Report form */}
      <div style={{ maxWidth: '480px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: '0 0 var(--space-6) 0',
          }}
        >
          {escalate ? 'Escalated case' : 'Report an issue'}
        </h3>

        {submitted ? (
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-md)',
              color: 'var(--color-gray-700)',
            }}
          >
            Thank you! We have received your report and will get back to you within 24 hours.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label
                htmlFor="support-category"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-lg)',
                  fontWeight: 500,
                  color: 'var(--color-gray-700)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Category
              </label>
              <select
                id="support-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) 0',
                  border: 'none',
                  borderBottom: '1.5px solid var(--color-gray-300)',
                  background: 'transparent',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-md)',
                  color: category ? 'var(--color-black)' : 'var(--color-gray-500)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="" disabled>Select category</option>
                <option value="power">Power outage</option>
                <option value="billing">Invoice</option>
                <option value="meter">Meter</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 'var(--space-8)' }}>
              <label
                htmlFor="support-description"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-lg)',
                  fontWeight: 500,
                  color: 'var(--color-gray-700)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Description
              </label>
              <textarea
                id="support-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your issue..."
                style={{
                  width: '100%',
                  padding: 'var(--space-3) 0',
                  border: 'none',
                  borderBottom: '1.5px solid var(--color-gray-300)',
                  background: 'transparent',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-md)',
                  color: 'var(--color-black)',
                  outline: 'none',
                  resize: 'vertical',
                }}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: 'var(--color-black)',
                color: 'var(--color-white)',
                border: 'none',
                padding: '14px 28px',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                minHeight: '44px',
                transition: `background var(--duration-fast) var(--ease-default)`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-gray-800)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-black)' }}
            >
              Submit report
            </button>
          </form>
        )}
      </div>

      {/* Separator */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--color-gray-100)', margin: 0 }} />

      {/* FAQ */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: '0 0 var(--space-6) 0',
          }}
        >
          Frequently asked questions
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0',
          }}
        >
          {faqItems.map((item, i) => (
            <div
              key={item.question}
              className="stagger-item"
              style={{
                borderLeft: i % 2 === 0 ? 'none' : '2px solid var(--color-gray-200)',
                paddingLeft: i % 2 === 0 ? '0' : 'var(--space-6)',
                paddingRight: 'var(--space-6)',
                paddingBottom: 'var(--space-6)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-heading-sm)',
                  fontWeight: 700,
                  color: 'var(--color-black)',
                  margin: '0 0 var(--space-2) 0',
                }}
              >
                {item.question}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'var(--color-gray-700)',
                  margin: 0,
                }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
