'use client'

import { useEffect, useState } from 'react'
import type { AiPolicy, AuditEntry } from '@/lib/aiPolicy'

interface PolicyResponse {
  policy: AiPolicy
  derived: { dynamic_discount_cap_pct: number; tone: string }
  audit: AuditEntry[]
}

const SEGMENT_OPTIONS = [
  { id: 'villa_solar_potential', label: 'Homeowners with solar potential' },
  { id: 'brf_charger', label: 'Housing associations (chargers)' },
  { id: 'high_consumption', label: 'High consumers (>20,000 kWh/yr)' },
  { id: 'green_ambassadors', label: 'Green customers (NPS ambassadors)' },
  { id: 'risk_customers', label: 'Risk customers (late payments)' },
]

/**
 * Admin: AI-policy / målstyrning av AI:n.
 * Källa: kravspec-uppdatering-2026-04.md §2
 */
export default function AiPolicyPage() {
  const [data, setData] = useState<PolicyResponse | null>(null)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState<AiPolicy | null>(null)
  const [showSim, setShowSim] = useState(false)

  useEffect(() => {
    fetch('/api/ai-policy')
      .then((r) => r.json())
      .then((d: PolicyResponse) => {
        setData(d)
        setDraft(d.policy)
      })
  }, [])

  if (!data || !draft) return <div style={{ color: 'var(--color-gray-500)' }}>Loading...</div>

  const dirty = JSON.stringify(draft) !== JSON.stringify(data.policy)

  const updateGoal = <K extends keyof AiPolicy['goals']>(key: K, value: AiPolicy['goals'][K]) =>
    setDraft((d) => (d ? { ...d, goals: { ...d.goals, [key]: value } } : d))

  const updateGuardrail = <K extends keyof AiPolicy['guardrails']>(
    key: K,
    value: AiPolicy['guardrails'][K]
  ) => setDraft((d) => (d ? { ...d, guardrails: { ...d.guardrails, [key]: value } } : d))

  const setSegmentWeight = (segId: string, weight: number) => {
    setDraft((d) => {
      if (!d) return d
      const exists = d.priority_segments.find((s) => s.segment === segId)
      const segments = exists
        ? d.priority_segments.map((s) => (s.segment === segId ? { ...s, weight } : s))
        : [...d.priority_segments, { segment: segId, weight }]
      return { ...d, priority_segments: segments }
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/ai-policy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const updated = await res.json()
      // Refresh full
      const fresh = await fetch('/api/ai-policy').then((r) => r.json())
      setData(fresh)
      setDraft(fresh.policy)
      setShowSim(false)
      console.log('Saved', updated)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--type-display-sm)', fontWeight: 700, margin: 0 }}>AI Policy</h1>
        <p style={{ color: 'var(--color-gray-700)', maxWidth: 720 }}>
          Set goals — the AI adapts its behavior. These are not rules, but direction. Changes
          take effect immediately and are logged.
        </p>
      </header>

      {/* KPI-strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
        <Kpi label="Revenue MTD vs target" value={`${(7_900_000).toLocaleString('sv-SE')} / ${data.policy.goals.revenue_target_sek.toLocaleString('sv-SE')}`} sub="63 %" />
        <Kpi label="Margin MTD" value={`${(data.policy.goals.margin_target_pct - 1.4).toFixed(1)} %`} sub={`Target ${data.policy.goals.margin_target_pct} %`} />
        <Kpi label="NPS last 30 days" value={`${data.policy.goals.nps_target - 3}`} sub={`Target ${data.policy.goals.nps_target}`} />
        <Kpi label="Marketing budget remaining" value={`${data.policy.goals.marketing_budget_remaining_sek.toLocaleString('sv-SE')} kr`} sub={`of ${data.policy.goals.marketing_budget_sek.toLocaleString('sv-SE')}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-6)' }}>
        {/* Kontroller */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Group title="A. Revenue target (kr/month)" effect="The further below target, the more active upselling and clearer CTAs.">
            <NumberInput
              value={draft.goals.revenue_target_sek}
              step={100_000}
              onChange={(v) => updateGoal('revenue_target_sek', v)}
              suffix=" kr"
            />
          </Group>

          <Group title="B. Profitability target (% margin)" effect={`Lower value = AI can offer larger discounts. Derived discount cap: ${data.derived.dynamic_discount_cap_pct} %.`}>
            <Slider min={5} max={40} value={draft.goals.margin_target_pct} onChange={(v) => updateGoal('margin_target_pct', v)} suffix=" %" />
          </Group>

          <Group title="C. Priority customer segments" effect="The AI spends more dialogue time and better offers on priority segments.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {SEGMENT_OPTIONS.map((opt) => {
                const w = draft.priority_segments.find((s) => s.segment === opt.id)?.weight ?? 0
                return (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ flex: 1 }}>{opt.label}</span>
                    <Slider min={0} max={100} value={w} onChange={(v) => setSegmentWeight(opt.id, v)} compact />
                  </div>
                )
              })}
            </div>
          </Group>

          <Group title="D. Customer satisfaction target (NPS)" effect={`High NPS priority makes the AI less pushy. Current tonality: "${data.derived.tone}".`}>
            <Slider min={0} max={100} value={draft.goals.nps_target} onChange={(v) => updateGoal('nps_target', v)} />
          </Group>

          <Group title="E. Marketing budget" effect="The AI can allocate discounts from this pool. When depleted, the AI automatically stops offering discounts.">
            <NumberInput
              value={draft.goals.marketing_budget_sek}
              step={10_000}
              onChange={(v) => updateGoal('marketing_budget_sek', v)}
              suffix=" kr"
            />
          </Group>

          <Group title="Safety guardrails" effect="Hard discount cap that the AI must never exceed.">
            <Slider min={0} max={50} value={draft.guardrails.max_discount_pct} onChange={(v) => updateGuardrail('max_discount_pct', v)} suffix=" %" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <input
                type="checkbox"
                checked={draft.guardrails.ai_paused}
                onChange={(e) => updateGuardrail('ai_paused', e.target.checked)}
              />
              <span style={{ fontWeight: 700, color: draft.guardrails.ai_paused ? 'var(--color-error)' : 'inherit' }}>
                Pause AI — send all customers to a human agent
              </span>
            </label>
          </Group>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              disabled={!dirty || saving}
              onClick={() => setShowSim(true)}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: dirty ? 'var(--color-black)' : 'var(--color-gray-300)',
                color: 'var(--color-white)',
                border: 'none',
                cursor: dirty ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }}
            >
              Review & save...
            </button>
            <button
              disabled={!dirty}
              onClick={() => setDraft(data.policy)}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'transparent',
                color: 'var(--color-gray-700)',
                border: '1px solid var(--color-gray-300)',
                cursor: dirty ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-primary)',
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* AI-spegel */}
        <aside
          style={{
            padding: 'var(--space-5)',
            background: 'var(--color-black)',
            color: 'var(--color-white)',
            borderLeft: '3px solid var(--color-accent)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            alignSelf: 'start',
          }}
        >
          <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI Mirror (live)
          </span>
          <Mirror label="AI currently gives on average" value={`${Math.max(0, data.derived.dynamic_discount_cap_pct - 8)} % discount`} />
          <Mirror label="Tonality" value={data.derived.tone} />
          <div>
            <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Top 3 products right now
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-2) 0 0' }}>
              {['Solar panels 10 kWp', 'Battery 10 kWh', 'Electricity plan Flex'].map((p, i) => (
                <li key={p} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-gray-800)' }}>
                  {i + 1}. {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Recent dialogues
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-2) 0 0', fontSize: 'var(--type-body-sm)' }}>
              {[
                'Homeowner in SE3 — suggested solar+battery',
                'Housing association in Stockholm — charger',
                'Moving — guided to moving view',
                'ROI question solar — showed business case',
                'Binding question — binding explainer',
              ].map((d, i) => (
                <li key={i} style={{ padding: 'var(--space-1) 0', color: 'var(--color-gray-300)' }}>
                  • {d}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Audit log */}
      <div>
        <h3 style={{ fontSize: 'var(--type-heading-sm)', margin: '0 0 var(--space-3)' }}>Audit log</h3>
        {data.audit.length === 0 ? (
          <p style={{ color: 'var(--color-gray-600)' }}>No changes yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--type-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--space-2)' }}>Time</th>
                <th style={{ textAlign: 'left', padding: 'var(--space-2)' }}>By</th>
                <th style={{ textAlign: 'left', padding: 'var(--space-2)' }}>Field</th>
                <th style={{ textAlign: 'left', padding: 'var(--space-2)' }}>From → To</th>
              </tr>
            </thead>
            <tbody>
              {data.audit.slice(0, 20).map((e, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                  <td style={{ padding: 'var(--space-2)' }}>{new Date(e.at).toLocaleString('sv-SE')}</td>
                  <td style={{ padding: 'var(--space-2)' }}>{e.by}</td>
                  <td style={{ padding: 'var(--space-2)', fontFamily: 'monospace' }}>{e.field}</td>
                  <td style={{ padding: 'var(--space-2)' }}>
                    {JSON.stringify(e.from)} → {JSON.stringify(e.to)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Simuleringsdialog */}
      {showSim && draft && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowSim(false)}
        >
          <div
            style={{ background: 'var(--color-white)', padding: 'var(--space-8)', maxWidth: 520, borderLeft: '3px solid var(--color-accent)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Expected effect</h3>
            <p style={{ color: 'var(--color-gray-700)' }}>
              Based on historical model. Lowered profitability target by{' '}
              <strong>{data.policy.goals.margin_target_pct - draft.goals.margin_target_pct} pp</strong> →
              estimated{' '}
              <strong>{data.policy.goals.margin_target_pct - draft.goals.margin_target_pct > 0 ? '+' : ''}
                {Math.round((data.policy.goals.margin_target_pct - draft.goals.margin_target_pct) * 4)} %
              </strong>{' '}
              conversion,{' '}
              <strong>{(draft.goals.margin_target_pct - data.policy.goals.margin_target_pct).toFixed(1)} pp</strong>{' '}
              margin.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
              <button onClick={save} disabled={saving} style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-accent)', color: 'var(--color-black)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
                {saving ? 'Saving...' : 'Confirm & save'}
              </button>
              <button onClick={() => setShowSim(false)} style={{ padding: 'var(--space-3) var(--space-5)', background: 'transparent', color: 'var(--color-gray-700)', border: '1px solid var(--color-gray-300)', cursor: 'pointer', fontFamily: 'var(--font-primary)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ padding: 'var(--space-4)', background: 'var(--color-white)', borderLeft: '3px solid var(--color-accent)' }}>
      <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ fontSize: 'var(--type-heading-md)', fontWeight: 700, lineHeight: 1.2, marginTop: 'var(--space-1)' }}>{value}</div>
      {sub && <span style={{ fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)' }}>{sub}</span>}
    </div>
  )
}

function Group({ title, effect, children }: { title: string; effect: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-white)', padding: 'var(--space-5)', borderLeft: '3px solid var(--color-gray-200)' }}>
      <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--type-heading-sm)' }}>{title}</h3>
      {children}
      <p style={{ marginTop: 'var(--space-3)', marginBottom: 0, color: 'var(--color-gray-600)', fontSize: 'var(--type-body-sm)' }}>
        <strong>AI-effekt:</strong> {effect}
      </p>
    </div>
  )
}

function NumberInput({
  value,
  step,
  onChange,
  suffix,
}: {
  value: number
  step: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-gray-300)', fontFamily: 'var(--font-primary)', width: 200 }}
      />
      {suffix && <span>{suffix}</span>}
    </div>
  )
}

function Slider({
  min,
  max,
  value,
  onChange,
  suffix = '',
  compact,
}: {
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  suffix?: string
  compact?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1 }}
      />
      <span style={{ fontWeight: 600, minWidth: compact ? 40 : 60, textAlign: 'right' }}>
        {value}
        {suffix}
      </span>
    </div>
  )
}

function Mirror({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div style={{ fontWeight: 700, fontSize: 'var(--type-heading-sm)', color: 'var(--color-accent)' }}>{value}</div>
    </div>
  )
}
