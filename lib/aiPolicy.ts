// AI policy ("control plane") for admin dashboard.
// In prototype, stored in memory (process state). Resets on restart.
// Source: requirements update 2026-04.md §2.6

export interface PrioritySegment {
  segment: string
  weight: number // 0–100
}

export interface AiPolicy {
  period: string
  goals: {
    revenue_target_sek: number
    margin_target_pct: number
    nps_target: number
    marketing_budget_sek: number
    marketing_budget_remaining_sek: number
  }
  priority_segments: PrioritySegment[]
  guardrails: {
    max_discount_pct: number
    ai_paused: boolean
  }
  updated_at: string
  updated_by: string
}

export interface AuditEntry {
  at: string
  by: string
  field: string
  from: unknown
  to: unknown
}

const DEFAULT_POLICY: AiPolicy = {
  period: '2026-04',
  goals: {
    revenue_target_sek: 12_500_000,
    margin_target_pct: 22,
    nps_target: 65,
    marketing_budget_sek: 450_000,
    marketing_budget_remaining_sek: 312_400,
  },
  priority_segments: [
    { segment: 'villa_solar_potential', weight: 80 },
    { segment: 'high_consumption', weight: 60 },
    { segment: 'brf_charger', weight: 30 },
    { segment: 'green_ambassadors', weight: 50 },
    { segment: 'risk_customers', weight: 10 },
  ],
  guardrails: {
    max_discount_pct: 25,
    ai_paused: false,
  },
  updated_at: new Date().toISOString(),
  updated_by: 'system',
}

// Module-scoped singleton (per Node process)
type Globals = typeof globalThis & {
  __energai_policy?: AiPolicy
  __energai_audit?: AuditEntry[]
}
const g = globalThis as Globals

export function getPolicy(): AiPolicy {
  if (!g.__energai_policy) g.__energai_policy = { ...DEFAULT_POLICY }
  return g.__energai_policy
}

export function getAuditLog(): AuditEntry[] {
  if (!g.__energai_audit) g.__energai_audit = []
  return g.__energai_audit
}

export function updatePolicy(
  patch: Partial<AiPolicy>,
  by: string = 'admin@energai.se'
): AiPolicy {
  const current = getPolicy()
  const merged: AiPolicy = {
    ...current,
    ...patch,
    goals: { ...current.goals, ...(patch.goals ?? {}) },
    guardrails: { ...current.guardrails, ...(patch.guardrails ?? {}) },
    priority_segments: patch.priority_segments ?? current.priority_segments,
    updated_at: new Date().toISOString(),
    updated_by: by,
  }
  // Diff & log
  const audit = getAuditLog()
  const at = merged.updated_at
  const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v as Record<string, unknown>, key))
      else out[key] = v
    }
    return out
  }
  const before = flatten(current as unknown as Record<string, unknown>)
  const after = flatten(merged as unknown as Record<string, unknown>)
  for (const k of Object.keys(after)) {
    if (k === 'updated_at' || k === 'updated_by') continue
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
      audit.unshift({ at, by, field: k, from: before[k], to: after[k] })
    }
  }
  // Trim audit
  if (audit.length > 200) audit.length = 200

  g.__energai_policy = merged
  return merged
}

// Derived by the AI: how much discount can the AI give right now?
export function dynamicDiscountCap(policy: AiPolicy): number {
  const { guardrails, goals } = policy
  // Simple heuristic: distance to profitability target -> more/less discount room
  // (in the prototype we keep it simple)
  const margin = goals.margin_target_pct
  const slack = Math.max(0, 30 - margin) // low margin target = more discount room
  return Math.min(guardrails.max_discount_pct, Math.round(slack))
}

// Helps the UI/AI describe the AI's current tonality
export function describeAiTone(policy: AiPolicy): 'advisory' | 'balanced' | 'sales-oriented' {
  const npsTarget = policy.goals.nps_target
  if (npsTarget >= 70) return 'advisory'
  if (npsTarget >= 50) return 'balanced'
  return 'sales-oriented'
}
