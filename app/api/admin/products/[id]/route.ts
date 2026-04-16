import { prisma } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        basePrice: body.basePrice !== undefined ? Number(body.basePrice) : undefined,
        specifications: body.specifications ? JSON.stringify(body.specifications) : undefined,
        installationIncluded: body.installationIncluded,
        installationTimeWeeks: body.installationTimeWeeks !== undefined ? Number(body.installationTimeWeeks) : undefined,
        warrantyYears: body.warrantyYears !== undefined ? Number(body.warrantyYears) : undefined,
        eligibleForRot: body.eligibleForRot,
        eligibleForGreenDeduction: body.eligibleForGreenDeduction,
        greenDeductionPercent: body.greenDeductionPercent !== undefined ? Number(body.greenDeductionPercent) : undefined,
        isActive: body.isActive,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      },
    })
    return Response.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return Response.json({ error: 'Could not update product' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.product.update({ where: { id }, data: { isActive: false } })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return Response.json({ error: 'Could not delete product' }, { status: 500 })
  }
}
