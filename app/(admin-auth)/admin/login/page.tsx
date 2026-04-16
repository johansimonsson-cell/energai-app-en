'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError('Invalid login credentials')
        return
      }

      const user = await res.json()
      if (user.role !== 'ADMIN') {
        setError('Insufficient permissions')
        return
      }

      sessionStorage.setItem('adminUser', JSON.stringify(user))
      router.push('/admin')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-black)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-display-sm)',
              fontWeight: 700,
              color: 'var(--color-white)',
              margin: 0,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Energai
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-sm)',
              color: 'var(--color-gray-500)',
              margin: 'var(--space-2) 0 0 0',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Admin
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {[
            { label: 'Email', type: 'email', value: email, onChange: setEmail },
            { label: 'Password', type: 'password', value: password, onChange: setPassword },
          ].map((field) => (
            <div key={field.label}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-lg)',
                  fontWeight: 400,
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-3) 0',
                  border: 'none',
                  borderBottom: '1.5px solid var(--color-gray-700)',
                  background: 'transparent',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-md)',
                  color: 'var(--color-white)',
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-white)' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-700)' }}
              />
            </div>
          ))}
        </div>

        {error && (
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-error)', margin: 0 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--color-white)',
            color: 'var(--color-black)',
            border: 'none',
            padding: '14px 28px',
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-sm)',
            fontWeight: 500,
            cursor: loading ? 'wait' : 'pointer',
            minHeight: '44px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
