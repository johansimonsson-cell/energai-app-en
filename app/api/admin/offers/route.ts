import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { validUntil: 'desc' },
    })
    return Response.json(offers)
  } catch (error) {
    console.error('Admin offers fetch error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, discountPercent, validUntil, targetSegment } =
      await request.json()

    if (!name || !description || discountPercent == null || !validUntil || !targetSegment) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    const offer = await prisma.offer.create({
      data: {
        name,
        description,
        discountPercent: Number(discountPercent),
        validUntil: new Date(validUntil),
        targetSegment,
        isActive: true,
      },
    })

    return Response.json(offer)
  } catch (error) {
    console.error('Admin offer create error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
