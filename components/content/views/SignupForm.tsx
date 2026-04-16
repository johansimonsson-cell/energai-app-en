'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'

const planNames: Record<string, string> = {
  fixed: 'Fixed price',
  variable: 'Variable rate',
  green: 'Green energy',
}

interface FormData {
  name: string
  email: string
  phone: string
  personalNumber: string
  address: string
  postalCode: string
  city: string
  password: string
}

interface FormErrors {
  [key: string]: string | undefined
}

const steps = [
  { number: '01', label: 'Personal details' },
  { number: '02', label: 'Address' },
  { number: '03', label: 'Confirm' },
]

function validate(form: FormData, step: number): FormErrors {
  const errors: FormErrors = {}

  if (step >= 0) {
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address'
    if (!form.phone.trim()) errors.phone = 'Phone number is required'
    if (!form.personalNumber.trim()) errors.personalNumber = 'Personal ID number is required'
    else if (!/^\d{8}-\d{4}$/.test(form.personalNumber)) errors.personalNumber = 'Format: YYYYMMDD-XXXX'
    if (!form.password.trim()) errors.password = 'Password is required'
    else if (form.password.length < 8) errors.password = 'At least 8 characters'
  }

  if (step >= 1) {
    if (!form.address.trim()) errors.address = 'Address is required'
    if (!form.postalCode.trim()) errors.postalCode = 'Postal code is required'
    if (!form.city.trim()) errors.city = 'City is required'
  }

  return errors
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (name: string, value: string) => void
  error?: string
  placeholder?: string
}) {
  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-label-lg)',
          fontWeight: 500,
          color: 'var(--color-gray-700)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: 'var(--space-3) 0',
          border: 'none',
          borderBottom: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-gray-300)'}`,
          background: 'transparent',
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-md)',
          color: 'var(--color-black)',
          outline: 'none',
          transition: `border-color var(--duration-fast) var(--ease-default)`,
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderBottomColor = 'var(--color-black)'
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)'
        }}
      />
      {error && (
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-label-md)',
            color: 'var(--color-error)',
            marginTop: 'var(--space-1)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}

export function SignupForm({ data }: { data: Record<string, unknown> }) {
  const planId = (data?.planId as string) || 'variable'
  const planName = planNames[planId] || 'Variable rate'
  const setContentView = useAppStore((s) => s.setContentView)
  const login = useAppStore((s) => s.login)

  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    personalNumber: '',
    address: '',
    postalCode: '',
    city: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Allow AI to pre-fill via data prop
  const prefill = data?.prefill as Partial<FormData> | undefined
  if (prefill) {
    Object.entries(prefill).forEach(([key, val]) => {
      if (val && !form[key as keyof FormData]) {
        setForm((prev) => ({ ...prev, [key]: val }))
      }
    })
  }

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleNext = () => {
    const stepErrors = validate(form, step)
    const relevantKeys = step === 0
      ? ['name', 'email', 'phone', 'personalNumber', 'password']
      : ['address', 'postalCode', 'city']

    const hasErrors = relevantKeys.some((k) => stepErrors[k])
    if (hasErrors) {
      const filtered: FormErrors = {}
      relevantKeys.forEach((k) => { if (stepErrors[k]) filtered[k] = stepErrors[k] })
      setErrors(filtered)
      return
    }
    setErrors({})
    setStep((s) => s + 1)
  }

  const handleSubmit = async () => {
    const allErrors = validate(form, 2)
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, planId }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setSubmitError(errorData.error || 'Something went wrong')
        return
      }

      // Auto-login
      await login(form.email, form.password)
      setContentView('confirmation', { planName, email: form.email }, 'fade')
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        maxWidth: '520px',
      }}
    >
      {/* Plan label */}
      <span
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-label-lg)',
          fontWeight: 500,
          color: 'var(--color-gray-600)',
          marginBottom: 'var(--space-2)',
        }}
      >
        Sign up for {planName}
      </span>

      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'clamp(28px, 4vw, var(--type-display-sm))',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          color: 'var(--color-black)',
          margin: '0 0 var(--space-10) 0',
        }}
      >
        Sign up
      </h2>

      {/* Step indicator */}
      <nav
        aria-label="Form steps"
        style={{
          display: 'flex',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-10)',
        }}
      >
        {steps.map((s, i) => (
          <div
            key={s.number}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-label-lg)',
                fontWeight: 500,
                color: i <= step ? 'var(--color-black)' : 'var(--color-gray-400)',
                transition: `color var(--duration-fast) var(--ease-default)`,
              }}
            >
              {s.number}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-label-lg)',
                fontWeight: 400,
                color: i <= step ? 'var(--color-black)' : 'var(--color-gray-400)',
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Step 0: Personal info */}
      {step === 0 && (
        <div>
          <FormField label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Anna Svensson" />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="anna@example.com" />
          <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="070-123 45 67" />
          <FormField label="Personal ID number" name="personalNumber" value={form.personalNumber} onChange={handleChange} error={errors.personalNumber} placeholder="YYYYMMDD-XXXX" />
          <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="At least 8 characters" />
        </div>
      )}

      {/* Step 1: Address */}
      {step === 1 && (
        <div>
          <FormField label="Street address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="Storgatan 12" />
          <FormField label="Postal code" name="postalCode" value={form.postalCode} onChange={handleChange} error={errors.postalCode} placeholder="111 22" />
          <FormField label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Stockholm" />
        </div>
      )}

      {/* Step 2: Confirmation */}
      {step === 2 && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
            }}
          >
            {[
              { label: 'Name', value: form.name },
              { label: 'Email', value: form.email },
              { label: 'Phone', value: form.phone },
              { label: 'Plan', value: planName },
              { label: 'Address', value: `${form.address}, ${form.postalCode} ${form.city}` },
              { label: 'Personal ID number', value: form.personalNumber },
            ].map((item) => (
              <div key={item.label}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 'var(--type-label-lg)',
                    fontWeight: 500,
                    color: 'var(--color-gray-600)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 'var(--type-body-md)',
                    fontWeight: 500,
                    color: 'var(--color-black)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {submitError && (
            <p
              style={{
                fontSize: 'var(--type-label-md)',
                color: 'var(--color-error)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {submitError}
            </p>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            type="button"
            style={{
              background: 'transparent',
              color: 'var(--color-black)',
              border: '1.5px solid var(--color-black)',
              padding: '14px 28px',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Back
          </button>
        )}

        {step < 2 ? (
          <button
            onClick={handleNext}
            type="button"
            style={{
              background: 'var(--color-black)',
              color: 'var(--color-white)',
              border: 'none',
              padding: '14px 28px',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-sm)',
              fontWeight: 500,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              minHeight: '44px',
              transition: `background var(--duration-fast) var(--ease-default)`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-gray-800)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-black)' }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-black)',
              border: 'none',
              padding: '14px 28px',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-sm)',
              fontWeight: 500,
              cursor: isSubmitting ? 'default' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              minHeight: '44px',
              transition: `opacity var(--duration-fast) var(--ease-default)`,
            }}
          >
            {isSubmitting ? 'Creating account...' : 'Confirm and sign up'}
          </button>
        )}
      </div>
    </section>
  )
}
