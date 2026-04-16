import { prisma } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const notes = await prisma.cRMNote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json(notes)
  } catch (error) {
    console.error('CRM notes fetch error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
