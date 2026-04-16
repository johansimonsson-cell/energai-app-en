import { prisma } from '@/lib/db'

interface CalculateRequest {
  productSlugs: string[]
  annualConsumptionKwh?: number
  monthlyElCost?: number
  priceArea?: string
  hasElCar?: boolean
  publicChargingCostPerKwh?: number
  financingType?: 'CASH' | 'INSTALLMENT' | 'LEASING'
  financingTermMonths?: number
}

// Average electricity prices per price area (öre/kWh including grid fees)
const PRICE_AREA_COSTS: Record<string, number> = {
  SE1: 80,
  SE2: 85,
  SE3: 140,
  SE4: 160,
}

// Default EV consumption
const DEFAULT_EV_KWH_PER_YEAR = 2500
const DEFAULT_PUBLIC_CHARGING_COST = 5.5 // kr/kWh
const NET_METERING_CREDIT = 0.60 // kr/kWh skattereduktion

export async function POST(request: Request) {
  try {
    const body: CalculateRequest = await request.json()
    const { productSlugs, priceArea, hasElCar, publicChargingCostPerKwh, financingType, financingTermMonths } = body

    // Fetch products
    const products = await prisma.product.findMany({
      where: { slug: { in: productSlugs }, isActive: true },
    })

    if (products.length === 0) {
      return new Response(JSON.stringify({ error: 'No products found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Determine electricity price
    const elprisOrePerKwh = PRICE_AREA_COSTS[priceArea || 'SE3'] || 140
    const elprisKrPerKwh = elprisOrePerKwh / 100

    // Estimate annual consumption
    let annualConsumption = body.annualConsumptionKwh || 0
    if (!annualConsumption && body.monthlyElCost) {
      annualConsumption = Math.round((body.monthlyElCost * 12) / elprisKrPerKwh)
    }

    // Calculate system totals
    let totalSystemPrice = 0
    let totalGreenDeduction = 0
    let totalRotDeduction = 0
    let totalAnnualProduction = 0
    let totalAnnualSavings = 0

    const productBreakdown = products.map(product => {
      const specs = product.specifications ? JSON.parse(product.specifications) : {}
      const price = product.basePrice

      // Green deduction (solceller)
      let greenDeduction = 0
      if (product.eligibleForGreenDeduction && product.greenDeductionPercent) {
        greenDeduction = Math.min(price * (product.greenDeductionPercent / 100), 50000)
      }

      // ROT deduction (installation work, typically 30% of labor ~30% of total)
      let rotDeduction = 0
      if (product.eligibleForRot) {
        const laborCost = price * 0.3 // estimate 30% is labor
        rotDeduction = Math.min(laborCost * 0.3, 50000)
      }

      // Annual production (for solar)
      let annualProduction = 0
      if (product.category === 'SOLAR' && specs.annualProduction) {
        const prodMatch = String(specs.annualProduction).replace(/[^\d]/g, '')
        annualProduction = parseInt(prodMatch) || 0
      }

      // Annual savings
      let annualSavings = 0
      if (product.category === 'SOLAR') {
        // Direct self-consumption ~70%, net metering ~30%
        const selfConsumption = annualProduction * 0.7
        const exported = annualProduction * 0.3
        annualSavings = (selfConsumption * elprisKrPerKwh) + (exported * NET_METERING_CREDIT)
      } else if (product.category === 'BATTERY') {
        // Battery increases self-consumption by ~20% of solar production
        annualSavings = (totalAnnualProduction * 0.2) * (elprisKrPerKwh - NET_METERING_CREDIT)
      }

      totalSystemPrice += price
      totalGreenDeduction += greenDeduction
      totalRotDeduction += rotDeduction
      totalAnnualProduction += annualProduction
      totalAnnualSavings += annualSavings

      return {
        slug: product.slug,
        name: product.name,
        category: product.category,
        price,
        greenDeduction,
        rotDeduction,
        netPrice: price - greenDeduction - rotDeduction,
        annualProduction,
        annualSavings: Math.round(annualSavings),
      }
    })

    // EV charging savings
    let chargingSavings = 0
    if (hasElCar) {
      const publicCost = publicChargingCostPerKwh || DEFAULT_PUBLIC_CHARGING_COST
      const homeCost = elprisKrPerKwh
      chargingSavings = Math.round((publicCost - homeCost) * DEFAULT_EV_KWH_PER_YEAR)
    }

    const totalNetPrice = totalSystemPrice - totalGreenDeduction - totalRotDeduction
    const totalAnnualSavingsWithEv = totalAnnualSavings + chargingSavings
    const paybackYears = totalAnnualSavingsWithEv > 0 ? +(totalNetPrice / totalAnnualSavingsWithEv).toFixed(1) : 0
    const twentyFiveYearProfit = Math.round(totalAnnualSavingsWithEv * 25 - totalNetPrice)

    // Financing calculation
    let monthlyPayment: number | null = null
    let totalFinancingCost: number | null = null
    if (financingType && financingType !== 'CASH' && financingTermMonths) {
      const financingOptions = await prisma.financingOption.findMany({
        where: { isActive: true, type: financingType },
      })
      if (financingOptions.length > 0) {
        const option = financingOptions[0]
        const rate = option.interestRatePercent / 100 / 12
        const n = financingTermMonths
        if (rate > 0) {
          monthlyPayment = Math.round(totalNetPrice * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1))
        } else {
          monthlyPayment = Math.round(totalNetPrice / n)
        }
        totalFinancingCost = monthlyPayment * n
      }
    }

    const result = {
      products: productBreakdown,
      totals: {
        systemPrice: totalSystemPrice,
        greenDeduction: totalGreenDeduction,
        rotDeduction: totalRotDeduction,
        netPrice: totalNetPrice,
        annualProduction: totalAnnualProduction,
        annualSavings: Math.round(totalAnnualSavings),
        chargingSavings,
        totalAnnualSavings: Math.round(totalAnnualSavingsWithEv),
        paybackYears,
        twentyFiveYearProfit,
      },
      financing: monthlyPayment ? {
        type: financingType,
        termMonths: financingTermMonths,
        monthlyPayment,
        totalCost: totalFinancingCost,
      } : null,
      assumptions: {
        priceArea: priceArea || 'SE3',
        elprisKrPerKwh,
        annualConsumptionKwh: annualConsumption,
        selfConsumptionRatio: 0.7,
        netMeteringCredit: NET_METERING_CREDIT,
        evKwhPerYear: hasElCar ? DEFAULT_EV_KWH_PER_YEAR : 0,
      },
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Calculate API error:', error)
    return new Response(JSON.stringify({ error: 'Calculation error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
