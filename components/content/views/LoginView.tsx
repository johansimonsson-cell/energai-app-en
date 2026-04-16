'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'

export function LoginView({ data: _data }: { data: Record<string, unknown> }) {
  const login = useAppStore((s) => s.login)
  const setContentView = useAppStore((s) => s.setContentView)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      setContentView('dashboard', {}, 'fade')
    } catch {
      setError('Incorrect email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        maxWidth: '400px',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'clamp(28px, 4vw, var(--type-display-sm))',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          color: 'var(--color-black)',
          margin: '0 0 var(--space-2) 0',
        }}
      >
        Log in
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-md)',
          color: 'var(--color-gray-600)',
          margin: '0 0 var(--space-10) 0',
        }}
      >
        To My pages
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label
            htmlFor="login-email"
            style={{
              display: 'block',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-label-lg)',
              fontWeight: 500,
              color: 'var(--color-gray-700)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.se"
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
            }}
            onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
            onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
          />
        </div>

        <div style={{ marginBottom: 'var(--space-8)' }}>
          <label
            htmlFor="login-password"
            style={{
              display: 'block',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-label-lg)',
              fontWeight: 500,
              color: 'var(--color-gray-700)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
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
            }}
            onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
            onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
          />
        </div>

        {error && (
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-label-md)',
              color: 'var(--color-error)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            background: 'var(--color-black)',
            color: 'var(--color-white)',
            border: 'none',
            padding: '14px 28px',
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-sm)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            cursor: isLoading ? 'default' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            minHeight: '44px',
            transition: `background var(--duration-fast) var(--ease-default)`,
          }}
          onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--color-gray-800)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-black)' }}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </section>
  )
}
