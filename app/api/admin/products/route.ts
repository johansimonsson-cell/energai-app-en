import { prisma } from '@/lib/db'

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: 'asc' } })
  return Response.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        category: body.category,
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription || null,
        priceType: body.priceType,
        basePrice: Number(body.basePrice),
        specifications: body.specifications ? JSON.stringify(body.specifications) : null,
        installationIncluded: body.installationIncluded || false,
        installationTimeWeeks: body.installationTimeWeeks ? Number(body.installationTimeWeeks) : null,
        warrantyYears: body.warrantyYears ? Number(body.warrantyYears) : null,
        eligibleForRot: body.eligibleForRot || false,
        eligibleForGreenDeduction: body.eligibleForGreenDeduction || false,
        greenDeductionPercent: body.greenDeductionPercent ? Number(body.greenDeductionPercent) : null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      },
    })
    return Response.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return Response.json({ error: 'Could not create product' }, { status: 500 })
  }
}
