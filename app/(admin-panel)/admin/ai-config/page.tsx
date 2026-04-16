'use client'

import { useEffect, useState, useCallback } from 'react'

interface ToneConfig { style: string; custom: string }
interface WelcomeConfig { message: string }
interface UpsellConfig { enabled: boolean; level: number; maxOffersPerSession: number }
interface DiscountConfig { aiCanGiveDiscount: boolean; maxDiscountPercent: number }
interface SafetyConfig { requireVerificationForChanges: boolean; escalateOnComplaints: boolean; blacklistedTopics: string[] }
interface ResponseConfig { maxSentences: number; language: string; useEmoji: boolean }

const toneOptions = ['Formal', 'Friendly', 'Casual', 'Professional']

export default function AIConfigPage() {
  const [tone, setTone] = useState<ToneConfig>({ style: 'Professional', custom: '' })
  const [welcome, setWelcome] = useState<WelcomeConfig>({ message: 'Hi! Welcome to Energai. How can I help you?' })
  const [upsell, setUpsell] = useState<UpsellConfig>({ enabled: true, level: 3, maxOffersPerSession: 1 })
  const [discount, setDiscount] = useState<DiscountConfig>({ aiCanGiveDiscount: false, maxDiscountPercent: 10 })
  const [safety, setSafety] = useState<SafetyConfig>({ requireVerificationForChanges: true, escalateOnComplaints: true, blacklistedTopics: [] })
  const [response, setResponse] = useState<ResponseConfig>({ maxSentences: 3, language: 'english', useEmoji: false })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [blacklistInput, setBlacklistInput] = useState('')

  useEffect(() => {
    fetch('/api/admin/config')
      .then(r => r.json())
      .then(data => {
        if (data.tone_of_voice) setTone(data.tone_of_voice)
        if (data.welcome_message) setWelcome(data.welcome_message)
        if (data.upsell_settings) setUpsell(data.upsell_settings)
        if (data.discount_settings) setDiscount(data.discount_settings)
        if (data.safety_settings) {
          setSafety(data.safety_settings)
          if (data.safety_settings.blacklistedTopics?.length) {
            setBlacklistInput(data.safety_settings.blacklistedTopics.join(', '))
          }
        }
        if (data.response_format) setResponse(data.response_format)
      })
      .catch(console.error)
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone_of_voice: tone,
          welcome_message: welcome,
          upsell_settings: upsell,
          discount_settings: discount,
          safety_settings: safety,
          response_format: response,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }, [tone, welcome, upsell, discount, safety, response])

  const sectionStyle = {
    background: 'var(--color-white)',
    border: '1px solid var(--color-gray-100)',
    padding: 'var(--space-8)',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 'var(--space-6)',
  }
  const titleStyle = { fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700 as const, color: 'var(--color-black)', margin: 0, letterSpacing: '-0.01em' }
  const labelStyle = { fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 500 as const, color: 'var(--color-gray-700)' }
  const descStyle = { fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)', margin: '2px 0 0 0' }
  const selectStyle = { display: 'block' as const, width: '100%', marginTop: 'var(--space-2)', padding: 'var(--space-3)', border: '1.5px solid var(--color-gray-200)', background: 'var(--color-white)', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-black)', outline: 'none', appearance: 'none' as const }
  const numberStyle = { ...selectStyle, width: '120px' }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-display-sm)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--color-black)', margin: 0 }}>
          AI Configuration
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: saved ? 'var(--color-success)' : 'var(--color-black)', color: 'var(--color-white)', border: 'none', padding: '12px 24px', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: saving ? 'wait' : 'pointer', minHeight: '44px', opacity: saving ? 0.6 : 1, transition: 'background var(--duration-fast) var(--ease-default)' }}
        >
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save all'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* 1. Tone of Voice */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>01 — Tone &amp; Style</h2>
          <div>
            <label style={labelStyle}>Tonality</label>
            <select value={tone.style} onChange={e => setTone(p => ({ ...p, style: e.target.value }))} style={selectStyle}>
              {toneOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Custom instructions</label>
            <p style={descStyle}>Free text added to the AI's system prompt.</p>
            <textarea value={tone.custom} onChange={e => setTone(p => ({ ...p, custom: e.target.value }))} rows={3} style={{ ...selectStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Welcome message</label>
            <p style={descStyle}>First message the AI sends to new visitors.</p>
            <textarea value={welcome.message} onChange={e => setWelcome({ message: e.target.value })} rows={2} style={{ ...selectStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* 2. Response Format */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>02 — Response Format</h2>
          <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Language</label>
              <select value={response.language} onChange={e => setResponse(p => ({ ...p, language: e.target.value }))} style={selectStyle}>
                <option value="english">English</option>
                <option value="swedish">Swedish</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Max sentences per response</label>
              <input type="number" min={1} max={10} value={response.maxSentences} onChange={e => setResponse(p => ({ ...p, maxSentences: Number(e.target.value) }))} style={numberStyle} />
            </div>
          </div>
          <ToggleRow label="Emojis" description="Allow the AI to use emojis" value={response.useEmoji} onChange={v => setResponse(p => ({ ...p, useEmoji: v }))} />
        </div>

        {/* 3. Upsell */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>03 — Upselling</h2>
          <ToggleRow label="Allow upselling" description="The AI mentions offers during customer conversations" value={upsell.enabled} onChange={v => setUpsell(p => ({ ...p, enabled: v }))} />
          {upsell.enabled && (
            <>
              <div>
                <label style={labelStyle}>Aggressiveness: {upsell.level}/5</label>
                <p style={descStyle}>{upsell.level <= 2 ? 'Very subtle' : upsell.level <= 3 ? 'Moderate' : 'Active'}</p>
                <input type="range" min={1} max={5} value={upsell.level} onChange={e => setUpsell(p => ({ ...p, level: Number(e.target.value) }))} style={{ width: '100%', marginTop: 'var(--space-2)', accentColor: 'var(--color-black)' }} />
              </div>
              <div>
                <label style={labelStyle}>Max offers per session</label>
                <input type="number" min={1} max={5} value={upsell.maxOffersPerSession} onChange={e => setUpsell(p => ({ ...p, maxOffersPerSession: Number(e.target.value) }))} style={numberStyle} />
              </div>
            </>
          )}
        </div>

        {/* 4. Discounts */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>04 — Discounts</h2>
          <ToggleRow label="AI can offer discounts" description="Allow the AI to offer discounts directly in chat" value={discount.aiCanGiveDiscount} onChange={v => setDiscount(p => ({ ...p, aiCanGiveDiscount: v }))} />
          {discount.aiCanGiveDiscount && (
            <div>
              <label style={labelStyle}>Max discount (%)</label>
              <input type="number" min={1} max={50} value={discount.maxDiscountPercent} onChange={e => setDiscount(p => ({ ...p, maxDiscountPercent: Number(e.target.value) }))} style={numberStyle} />
            </div>
          )}
        </div>

        {/* 5. Security */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>05 — Security</h2>
          <ToggleRow label="Require verification" description="Customer must confirm before contract changes" value={safety.requireVerificationForChanges} onChange={v => setSafety(p => ({ ...p, requireVerificationForChanges: v }))} />
          <ToggleRow label="Escalate complaints" description="AI suggests a human agent when customer is dissatisfied" value={safety.escalateOnComplaints} onChange={v => setSafety(p => ({ ...p, escalateOnComplaints: v }))} />
          <div>
            <label style={labelStyle}>Blacklisted topics</label>
            <p style={descStyle}>Comma-separated list of topics the AI should not discuss.</p>
            <input type="text" value={blacklistInput} onChange={e => { setBlacklistInput(e.target.value); setSafety(p => ({ ...p, blacklistedTopics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })) }}
              placeholder="e.g. politics, religion" style={{ ...selectStyle, marginTop: 'var(--space-2)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
      <div>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 500, color: 'var(--color-gray-700)' }}>{label}</span>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)', margin: '2px 0 0 0' }}>{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
        style={{ flexShrink: 0, width: '44px', height: '24px', background: value ? 'var(--color-black)' : 'var(--color-gray-200)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background var(--duration-fast) var(--ease-default)' }}>
        <span style={{ position: 'absolute', top: '2px', left: value ? '22px' : '2px', width: '20px', height: '20px', background: 'var(--color-white)', transition: 'left var(--duration-fast) var(--ease-default)' }} />
      </button>
    </div>
  )
}
