import { prisma } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.discountPercent !== undefined && { discountPercent: Number(data.discountPercent) }),
        ...(data.validUntil !== undefined && { validUntil: new Date(data.validUntil) }),
        ...(data.targetSegment !== undefined && { targetSegment: data.targetSegment }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })

    return Response.json(offer)
  } catch (error) {
    console.error('Admin offer update error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.offer.delete({ where: { id } })
    return Response.json({ deleted: true })
  } catch (error) {
    console.error('Admin offer delete error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
