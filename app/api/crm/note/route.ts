import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { userId, type, content, createdBy } = await request.json()

    if (!userId || !type || !content) {
      return Response.json({ error: 'userId, type, and content are required' }, { status: 400 })
    }

    const validTypes = ['CALL', 'CHAT', 'NOTE', 'UPSELL_ATTEMPT', 'SUPPORT']
    if (!validTypes.includes(type)) {
      return Response.json({ error: `Invalid type. Allowed: ${validTypes.join(', ')}` }, { status: 400 })
    }

    const note = await prisma.cRMNote.create({
      data: {
        userId,
        type,
        content,
        createdBy: createdBy || 'system',
      },
    })

    return Response.json(note)
  } catch (error) {
    console.error('CRM note error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
