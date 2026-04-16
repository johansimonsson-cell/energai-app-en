// Energai Flex – produktkatalog med bindningstider och paketrabatter.
// Källa: kravspec-uppdatering-2026-04.md §1.2

export type FlexProductId = 'electricity' | 'solar' | 'battery' | 'charger'
export type BindingYears = 5 | 10 | 15

export interface FlexProduct {
  id: FlexProductId
  name: string
  shortDescription: string
  hasBinding: boolean
  // For hardware: månadspris per bindningstid
  monthlyByBinding?: Record<BindingYears, number>
  // For elavtal
  fixedMonthlyFee?: number
  spotMarkupOrePerKwh?: number
  // Hårdvarukostnad efter avdrag (för UI)
  netHardwareCost?: number
  // För tooltip/kalkyl
  effectiveAprByBinding?: Record<BindingYears, number>
}

export const FLEX_PRODUCTS: FlexProduct[] = [
  {
    id: 'electricity',
    name: 'Electricity contract',
    shortDescription: 'Spot price + 10 öre/kWh. No binding.',
    hasBinding: false,
    fixedMonthlyFee: 39,
    spotMarkupOrePerKwh: 10,
  },
  {
    id: 'solar',
    name: 'Solar panels',
    shortDescription: '10 kWp standard package, ~150,000 kr after green deduction.',
    hasBinding: true,
    netHardwareCost: 150000,
    monthlyByBinding: { 5: 2750, 10: 1500, 15: 1100 },
    effectiveAprByBinding: { 5: 3.9, 10: 3.7, 15: 3.8 },
  },
  {
    id: 'battery',
    name: 'Battery',
    shortDescription: '10 kWh, ~80,000 kr.',
    hasBinding: true,
    netHardwareCost: 80000,
    monthlyByBinding: { 5: 1475, 10: 805, 15: 590 },
    effectiveAprByBinding: { 5: 4.0, 10: 3.8, 15: 3.9 },
  },
  {
    id: 'charger',
    name: 'EV charger',
    shortDescription: '11 kW, ~15,000 kr incl. installation after ROT.',
    hasBinding: true,
    netHardwareCost: 15000,
    monthlyByBinding: { 5: 280, 10: 155, 15: 115 },
    effectiveAprByBinding: { 5: 4.5, 10: 4.2, 15: 4.3 },
  },
]

export function getFlexProduct(id: FlexProductId): FlexProduct {
  const p = FLEX_PRODUCTS.find((x) => x.id === id)
  if (!p) throw new Error(`Unknown flex product: ${id}`)
  return p
}

// ——— Paketrabatter (additivt på fast del) ———
// Kontroll: mängd hårdvaror + ev. elavtal
export function calculateBundleDiscount(selected: FlexProductId[]): number {
  const has = (id: FlexProductId) => selected.includes(id)
  const sol = has('solar')
  const bat = has('battery')
  const lad = has('charger')
  const el = has('electricity')

  if (sol && bat && lad && el) return 0.2 // 20 %
  if (sol && bat && lad) return 0.15 // 15 %
  if (sol && bat) return 0.1 // 10 %
  return 0
}

// ——— Nätavgift mock per prisområde (öre/kWh) ———
export const NETWORK_FEE_ORE_PER_KWH: Record<string, number> = {
  SE1: 28,
  SE2: 30,
  SE3: 35,
  SE4: 42,
}

export function getNetworkFee(area: string | null | undefined): number {
  if (!area) return NETWORK_FEE_ORE_PER_KWH.SE3
  return NETWORK_FEE_ORE_PER_KWH[area] ?? NETWORK_FEE_ORE_PER_KWH.SE3
}

// ——— Aggregerad kalkyl för en konfiguration ———
export interface FlexSelection {
  productId: FlexProductId
  bindingYears?: BindingYears // krävs för hårdvara
}

export interface FlexCalculation {
  selections: FlexSelection[]
  fixedMonthlyBase: number // före rabatt
  bundleDiscountPct: number
  fixedMonthlyDiscount: number
  fixedMonthly: number // efter rabatt
  spotMarkupOrePerKwh: number // alltid 10 om elavtal med
  hasElectricity: boolean
  // För tidslinjen
  bindingByProduct: Record<string, BindingYears>
  longestBindingYears: number
}

export function calculateFlex(selections: FlexSelection[]): FlexCalculation {
  let fixedBase = 0
  let hasElectricity = false
  const bindingByProduct: Record<string, BindingYears> = {}

  for (const sel of selections) {
    const p = getFlexProduct(sel.productId)
    if (sel.productId === 'electricity') {
      hasElectricity = true
      fixedBase += p.fixedMonthlyFee ?? 0
    } else if (p.monthlyByBinding && sel.bindingYears) {
      fixedBase += p.monthlyByBinding[sel.bindingYears]
      bindingByProduct[sel.productId] = sel.bindingYears
    }
  }

  const bundleDiscountPct = calculateBundleDiscount(selections.map((s) => s.productId))
  const fixedMonthlyDiscount = Math.round(fixedBase * bundleDiscountPct)
  const fixedMonthly = fixedBase - fixedMonthlyDiscount

  const longestBindingYears = Object.values(bindingByProduct).reduce(
    (max, y) => Math.max(max, y),
    0
  )

  return {
    selections,
    fixedMonthlyBase: fixedBase,
    bundleDiscountPct,
    fixedMonthlyDiscount,
    fixedMonthly,
    spotMarkupOrePerKwh: 10,
    hasElectricity,
    bindingByProduct,
    longestBindingYears,
  }
}

// Estimerad rörlig månadskostnad (kr/mån) baserat på årsförbrukning + spot-snitt + ev. nätavgift
export function estimateVariableMonthly(params: {
  annualKwh: number
  spotAverageOrePerKwh: number
  includeNetworkFee: boolean
  area: string
}): number {
  const { annualKwh, spotAverageOrePerKwh, includeNetworkFee, area } = params
  const markup = 10
  const network = includeNetworkFee ? getNetworkFee(area) : 0
  const orePerKwh = spotAverageOrePerKwh + markup + network
  const krPerKwh = orePerKwh / 100
  return Math.round((annualKwh * krPerKwh) / 12)
}
