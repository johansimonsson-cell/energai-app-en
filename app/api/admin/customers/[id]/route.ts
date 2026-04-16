import { prisma } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const customer = await prisma.user.findUnique({
      where: { id },
      include: {
        agreements: true,
        crmNotes: { orderBy: { createdAt: 'desc' } },
        chatSessions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        },
      },
    })

    if (!customer) {
      return Response.json({ error: 'Customer not found' }, { status: 404 })
    }

    return Response.json(customer)
  } catch (error) {
    console.error('Admin customer detail error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
