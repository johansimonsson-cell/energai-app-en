import { prisma } from '@/lib/db'

interface QuoteRequest {
  productSlugs: string[]
  financingType?: 'CASH' | 'INSTALLMENT' | 'LEASING'
  financingTermMonths?: number
  address?: string
  bundleSlug?: string
}

export async function POST(request: Request) {
  try {
    const body: QuoteRequest = await request.json()
    const { productSlugs, financingType = 'CASH', financingTermMonths = 60, address } = body

    // Fetch products
    const products = await prisma.product.findMany({
      where: { slug: { in: productSlugs }, isActive: true },
    })

    if (products.length === 0) {
      return Response.json({ error: 'No valid products found' }, { status: 400 })
    }

    // Check for applicable bundle
    let bundleDiscount = 0
    const bundles = await prisma.bundle.findMany({
      where: { isActive: true },
      include: { products: { include: { product: true } } },
    })

    for (const bundle of bundles) {
      const bundleProductSlugs = bundle.products.map(bp => bp.product.slug)
      const allIncluded = bundleProductSlugs.every(slug => productSlugs.includes(slug))
      if (allIncluded && bundle.bundleDiscount > bundleDiscount) {
        bundleDiscount = bundle.bundleDiscount
      }
    }

    // Calculate totals
    const hardwareProducts = products.filter(p => p.category !== 'ELECTRICITY_PLAN')
    const electricityPlans = products.filter(p => p.category === 'ELECTRICITY_PLAN')

    let totalHardwarePrice = 0
    const lineItems = hardwareProducts.map(p => {
      totalHardwarePrice += p.basePrice
      return {
        productSlug: p.slug,
        productName: p.name,
        category: p.category,
        unitPrice: p.basePrice,
        quantity: 1,
        lineTotal: p.basePrice,
      }
    })

    // Apply bundle discount
    const bundleDiscountAmount = Math.round(totalHardwarePrice * (bundleDiscount / 100))
    const priceAfterBundle = totalHardwarePrice - bundleDiscountAmount

    // Calculate ROT deduction (30% of labor, estimate labor as 30% of total)
    const laborEstimate = Math.round(priceAfterBundle * 0.30)
    const rotEligibleProducts = hardwareProducts.filter(p => p.eligibleForRot)
    const rotDeduction = rotEligibleProducts.length > 0
      ? Math.min(Math.round(laborEstimate * 0.30), 50000)
      : 0

    // Calculate green deduction (20% of total for solar, max 50000)
    const greenEligibleProducts = hardwareProducts.filter(p => p.eligibleForGreenDeduction)
    const greenDeductionBase = greenEligibleProducts.reduce((sum, p) => sum + p.basePrice, 0)
    const greenDeduction = greenEligibleProducts.length > 0
      ? Math.min(Math.round(greenDeductionBase * 0.20), 50000)
      : 0

    const netPrice = priceAfterBundle - rotDeduction - greenDeduction
    const totalDeductions = rotDeduction + greenDeduction + bundleDiscountAmount

    // Financing calculation
    let monthlyPayment: number | null = null
    let totalFinancingCost: number | null = null
    let interestRate: number | null = null

    if (financingType !== 'CASH') {
      const financingOption = await prisma.financingOption.findFirst({
        where: {
          type: financingType,
          isActive: true,
          minAmount: { lte: netPrice },
        },
      })

      if (financingOption) {
        interestRate = financingOption.interestRatePercent
        const monthlyRate = interestRate / 100 / 12
        const nMonths = financingTermMonths

        if (monthlyRate > 0) {
          monthlyPayment = Math.round(netPrice * (monthlyRate * Math.pow(1 + monthlyRate, nMonths)) / (Math.pow(1 + monthlyRate, nMonths) - 1))
          totalFinancingCost = monthlyPayment * nMonths
        } else {
          monthlyPayment = Math.round(netPrice / nMonths)
          totalFinancingCost = netPrice
        }
      }
    }

    // ROI calculation (for solar/battery)
    const solarProducts = hardwareProducts.filter(p => p.category === 'SOLAR')
    let annualSavings = 0
    let paybackYears: number | null = null

    if (solarProducts.length > 0) {
      for (const sp of solarProducts) {
        const specs = sp.specifications ? JSON.parse(sp.specifications) : {}
        const annualProd = parseInt(String(specs.annualProduction || '0').replace(/\D/g, ''))
        annualSavings += Math.round(annualProd * 1.2) // ~1.2 kr/kWh total value
      }
      if (annualSavings > 0) {
        paybackYears = Math.round((netPrice / annualSavings) * 10) / 10
      }
    }

    return Response.json({
      lineItems,
      electricityPlans: electricityPlans.map(p => ({
        slug: p.slug,
        name: p.name,
        basePrice: p.basePrice,
      })),
      subtotal: totalHardwarePrice,
      bundleDiscount: bundleDiscountAmount,
      bundleDiscountPercent: bundleDiscount,
      priceAfterBundle,
      rotDeduction,
      greenDeduction,
      totalDeductions,
      netPrice,
      financing: financingType !== 'CASH' ? {
        type: financingType,
        termMonths: financingTermMonths,
        interestRate,
        monthlyPayment,
        totalCost: totalFinancingCost,
      } : null,
      roi: annualSavings > 0 ? {
        annualSavings,
        paybackYears,
      } : null,
      address: address || null,
    })
  } catch (error) {
    console.error('Quote error:', error)
    return Response.json({ error: 'Could not calculate quote' }, { status: 500 })
  }
}
