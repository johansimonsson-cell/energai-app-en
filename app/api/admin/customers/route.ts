import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const planType = searchParams.get('planType') || ''

    const customers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        agreements: true,
        _count: { select: { crmNotes: true, chatSessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Filter by agreement status/planType in JS (SQLite limitations)
    const filtered = customers.filter((c) => {
      if (status && !c.agreements.some((a) => a.status === status)) return false
      if (planType && !c.agreements.some((a) => a.planType === planType)) return false
      return true
    })

    return Response.json(filtered)
  } catch (error) {
    console.error('Admin customers error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
