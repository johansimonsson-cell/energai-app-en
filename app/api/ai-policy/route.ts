import { getPolicy, updatePolicy, getAuditLog, dynamicDiscountCap, describeAiTone } from '@/lib/aiPolicy'

export async function GET() {
  const policy = getPolicy()
  return Response.json({
    policy,
    derived: {
      dynamic_discount_cap_pct: dynamicDiscountCap(policy),
      tone: describeAiTone(policy),
    },
    audit: getAuditLog().slice(0, 50),
  })
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const updated = updatePolicy(body, body?.updated_by ?? 'admin@energai.se')
    return Response.json({ policy: updated })
  } catch (e) {
    console.error('AI policy update error', e)
    return Response.json({ error: 'Could not update policy' }, { status: 500 })
  }
}
