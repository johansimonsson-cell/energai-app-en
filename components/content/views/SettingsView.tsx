'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'

export function SettingsView({ data: _data }: { data: Record<string, unknown> }) {
  const user = useAppStore((s) => s.user)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [phone, setPhone] = useState('070-123 45 67')

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        maxWidth: '520px',
        gap: 'var(--space-10)',
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
        Settings
      </h2>

      {/* Personal info */}
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
          Personal details
        </h3>

        {[
          { label: 'Name', value: name, onChange: setName, disabled: false },
          { label: 'Email', value: email, onChange: () => {}, disabled: true },
          { label: 'Phone', value: phone, onChange: setPhone, disabled: false },
        ].map((field) => (
          <div key={field.label} style={{ marginBottom: 'var(--space-6)' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-label-lg)',
                fontWeight: 500,
                color: 'var(--color-gray-700)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={field.disabled}
              style={{
                width: '100%',
                padding: 'var(--space-3) 0',
                border: 'none',
                borderBottom: '1.5px solid var(--color-gray-300)',
                background: 'transparent',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-md)',
                color: field.disabled ? 'var(--color-gray-500)' : 'var(--color-black)',
                outline: 'none',
              }}
              onFocus={(e) => { if (!field.disabled) e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
            />
          </div>
        ))}

        <button
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
          Save changes
        </button>
      </div>

      {/* Separator */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--color-gray-100)', margin: 0 }} />

      {/* Avtal section */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Contract
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-sm)',
            color: 'var(--color-gray-700)',
            margin: '0 0 var(--space-6) 0',
            maxWidth: '50ch',
          }}
        >
          Cancelling your contract means electricity delivery will end at the next billing period.
          Contact us in the chat if you have any questions.
        </p>
        <button
          onClick={() => setShowCancelModal(true)}
          style={{
            background: 'transparent',
            color: 'var(--color-error)',
            border: '1.5px solid var(--color-error)',
            padding: '14px 28px',
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-sm)',
            fontWeight: 500,
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Cancel contract
        </button>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            style={{
              background: 'var(--color-black)',
              padding: 'var(--space-10)',
              maxWidth: '440px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm cancellation"
          >
            <h3
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-heading-md)',
                fontWeight: 700,
                color: 'var(--color-white)',
                margin: '0 0 var(--space-4) 0',
              }}
            >
              Cancel contract?
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                color: 'rgba(255,255,255,0.7)',
                margin: '0 0 var(--space-8) 0',
              }}
            >
              Your contract will end at the next billing period. You can always sign a new contract later.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  background: 'var(--color-white)',
                  color: 'var(--color-black)',
                  border: 'none',
                  padding: '14px 28px',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Go back
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  background: 'transparent',
                  color: 'var(--color-error)',
                  border: '1.5px solid var(--color-error)',
                  padding: '14px 28px',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Confirm cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
