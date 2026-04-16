import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      totalCustomers,
      newRegistrations,
      activeSessions,
      totalAgreements,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.chatSession.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.electricityAgreement.count({
        where: { status: 'ACTIVE' },
      }),
    ])

    // Mock conversion rate
    const conversionRate = totalCustomers > 0 ? 23.4 : 0

    return Response.json({
      totalCustomers,
      newRegistrations,
      activeSessions,
      totalAgreements,
      conversionRate,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
