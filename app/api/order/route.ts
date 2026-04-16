import { prisma } from '@/lib/db'

interface OrderRequest {
  userId: string
  productSlugs: string[]
  financingType?: 'CASH' | 'INSTALLMENT' | 'LEASING'
  financingTermMonths?: number
  address?: string
}

export async function POST(request: Request) {
  try {
    const body: OrderRequest = await request.json()
    const { userId, productSlugs, financingType = 'CASH', financingTermMonths = 60, address } = body

    if (!userId) {
      return Response.json({ error: 'User required' }, { status: 400 })
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where: { slug: { in: productSlugs }, isActive: true, category: { not: 'ELECTRICITY_PLAN' } },
    })

    if (products.length === 0) {
      return Response.json({ error: 'No valid hardware products' }, { status: 400 })
    }

    // Calculate pricing (same logic as quote)
    let totalPrice = products.reduce((sum, p) => sum + p.basePrice, 0)

    // Check bundle discount
    let bundleDiscount = 0
    const bundles = await prisma.bundle.findMany({
      where: { isActive: true },
      include: { products: { include: { product: true } } },
    })
    for (const bundle of bundles) {
      const bundleSlugs = bundle.products.map(bp => bp.product.slug)
      if (bundleSlugs.every(s => productSlugs.includes(s)) && bundle.bundleDiscount > bundleDiscount) {
        bundleDiscount = bundle.bundleDiscount
      }
    }

    const bundleDiscountAmount = Math.round(totalPrice * (bundleDiscount / 100))
    totalPrice -= bundleDiscountAmount

    // Deductions
    const laborEstimate = Math.round(totalPrice * 0.30)
    const rotDeduction = products.some(p => p.eligibleForRot)
      ? Math.min(Math.round(laborEstimate * 0.30), 50000)
      : 0

    const greenBase = products.filter(p => p.eligibleForGreenDeduction).reduce((s, p) => s + p.basePrice, 0)
    const greenDeduction = greenBase > 0 ? Math.min(Math.round(greenBase * 0.20), 50000) : 0

    const netPrice = totalPrice - rotDeduction - greenDeduction

    // Financing
    let monthlyPayment: number | null = null
    let interestRate: number | null = null

    if (financingType !== 'CASH') {
      const option = await prisma.financingOption.findFirst({
        where: { type: financingType, isActive: true },
      })
      if (option) {
        interestRate = option.interestRatePercent
        const monthlyRate = interestRate / 100 / 12
        monthlyPayment = Math.round(netPrice * (monthlyRate * Math.pow(1 + monthlyRate, financingTermMonths)) / (Math.pow(1 + monthlyRate, financingTermMonths) - 1))
      }
    }

    // Create order
    const order = await prisma.hardwareOrder.create({
      data: {
        userId,
        status: 'CONFIRMED',
        totalPrice: totalPrice + bundleDiscountAmount, // original total
        rotDeduction,
        greenDeduction,
        netPrice,
        financingType,
        monthlyPayment,
        installmentMonths: financingType !== 'CASH' ? financingTermMonths : null,
        interestRate,
        items: {
          create: products.map(p => ({
            productId: p.id,
            quantity: 1,
            unitPrice: p.basePrice,
            lineTotal: p.basePrice,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    // Create CRM note
    await prisma.cRMNote.create({
      data: {
        userId,
        type: 'HARDWARE_INQUIRY',
        content: `Order created: ${products.map(p => p.name).join(', ')}. Total: ${netPrice.toLocaleString('sv-SE')} kr (after deductions). Financing: ${financingType}.`,
        createdBy: 'AI',
      },
    })

    return Response.json({
      orderId: order.id,
      status: order.status,
      items: order.items.map(i => ({ name: i.product.name, price: i.unitPrice })),
      totalPrice: order.totalPrice,
      deductions: { rot: rotDeduction, green: greenDeduction, bundle: bundleDiscountAmount },
      netPrice: order.netPrice,
      financing: monthlyPayment ? {
        type: financingType,
        monthlyPayment,
        termMonths: financingTermMonths,
        interestRate,
      } : null,
    })
  } catch (error) {
    console.error('Order error:', error)
    return Response.json({ error: 'Could not create order' }, { status: 500 })
  }
}
