// Historical electricity market data + ROI calculations.
// Nord Pool API is not available in the prototype - we generate realistic synthetic data
// with seasonal patterns (winter more expensive, daily curve with price peaks 07-09 and 17-20).
// Source: requirements update 2026-04.md §3

export type PriceArea = 'SE1' | 'SE2' | 'SE3' | 'SE4'
export type Granularity = 'hour' | 'day' | 'month'

interface AreaProfile {
  // Average price per year, öre/kWh
  yearAverageOre: number
  // Daily variance (peak - valley), öre/kWh average
  dailyVarianceOre: number
}

const AREA_PROFILES: Record<PriceArea, AreaProfile> = {
  SE1: { yearAverageOre: 38, dailyVarianceOre: 35 },
  SE2: { yearAverageOre: 42, dailyVarianceOre: 40 },
  SE3: { yearAverageOre: 87, dailyVarianceOre: 140 },
  SE4: { yearAverageOre: 105, dailyVarianceOre: 170 },
}

// Deterministic pseudo-random without dependencies (Mulberry32)
function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Season factor: 1 in January (expensive), down to 0.55 in July (cheap)
function seasonFactor(date: Date): number {
  const month = date.getUTCMonth() // 0–11
  // Cosine season: peak in Jan, valley in Jul
  const phase = ((month + 0) / 12) * Math.PI * 2
  return 0.78 + 0.22 * Math.cos(phase)
}

// Daily curve: price peaks 07-09 and 17-20, valley 02-05 and 12-14
function hourFactor(hour: number): number {
  // Two peaks
  const peak1 = Math.exp(-Math.pow((hour - 8) / 1.6, 2)) * 0.6
  const peak2 = Math.exp(-Math.pow((hour - 18.5) / 1.8, 2)) * 0.8
  // Dip midday (solar)
  const dip = Math.exp(-Math.pow((hour - 13) / 2, 2)) * -0.35
  // Night valley
  const night = hour >= 1 && hour <= 5 ? -0.3 : 0
  return 1 + peak1 + peak2 + dip + night
}

export interface SpotPoint {
  ts: string // ISO
  area: PriceArea
  ore_per_kwh: number
}

function generateHourly(area: PriceArea, from: Date, to: Date): SpotPoint[] {
  const profile = AREA_PROFILES[area]
  const points: SpotPoint[] = []
  // Seed combines area and date part for stability
  const seedBase = area.charCodeAt(2) * 1000
  const ms = 60 * 60 * 1000
  for (let t = from.getTime(); t < to.getTime(); t += ms) {
    const date = new Date(t)
    const rng = mulberry32(seedBase + Math.floor(t / ms))
    const noise = (rng() - 0.5) * profile.dailyVarianceOre * 0.4
    const base = profile.yearAverageOre * seasonFactor(date)
    const hour = date.getUTCHours()
    const value = base * hourFactor(hour) + noise
    points.push({
      ts: date.toISOString(),
      area,
      ore_per_kwh: Math.max(-30, Math.round(value * 10) / 10),
    })
  }
  return points
}

export function getSpot(params: {
  area: PriceArea
  from: Date
  to: Date
  granularity: Granularity
}): SpotPoint[] {
  const hourly = generateHourly(params.area, params.from, params.to)
  if (params.granularity === 'hour') return hourly

  // Aggregate
  const buckets = new Map<string, number[]>()
  for (const p of hourly) {
    const d = new Date(p.ts)
    const key =
      params.granularity === 'day'
        ? d.toISOString().slice(0, 10)
        : d.toISOString().slice(0, 7)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(p.ore_per_kwh)
  }
  return Array.from(buckets.entries())
    .sort()
    .map(([key, vals]) => ({
      ts: key + (params.granularity === 'day' ? 'T00:00:00Z' : '-01T00:00:00Z'),
      area: params.area,
      ore_per_kwh: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10,
    }))
}

export interface SpotStats {
  area: PriceArea
  from: string
  to: string
  count: number
  averageOre: number
  medianOre: number
  p10Ore: number
  p90Ore: number
  averageDailyVarianceOre: number
}

export function getStats(params: {
  area: PriceArea
  from: Date
  to: Date
}): SpotStats {
  const hourly = generateHourly(params.area, params.from, params.to)
  const sorted = [...hourly].sort((a, b) => a.ore_per_kwh - b.ore_per_kwh)
  const at = (q: number) => sorted[Math.floor(sorted.length * q)]?.ore_per_kwh ?? 0
  const sum = hourly.reduce((s, p) => s + p.ore_per_kwh, 0)
  const avg = sum / hourly.length

  // Average daily variance
  const byDay = new Map<string, number[]>()
  for (const p of hourly) {
    const k = p.ts.slice(0, 10)
    if (!byDay.has(k)) byDay.set(k, [])
    byDay.get(k)!.push(p.ore_per_kwh)
  }
  const variances = Array.from(byDay.values()).map((vs) => Math.max(...vs) - Math.min(...vs))
  const avgVar = variances.reduce((a, b) => a + b, 0) / Math.max(1, variances.length)

  return {
    area: params.area,
    from: params.from.toISOString(),
    to: params.to.toISOString(),
    count: hourly.length,
    averageOre: Math.round(avg * 10) / 10,
    medianOre: Math.round(at(0.5) * 10) / 10,
    p10Ore: Math.round(at(0.1) * 10) / 10,
    p90Ore: Math.round(at(0.9) * 10) / 10,
    averageDailyVarianceOre: Math.round(avgVar * 10) / 10,
  }
}

// --- Average daily curve last N days ---
export function getAverageDailyCurve(params: { area: PriceArea; days: number }): number[] {
  const to = new Date()
  const from = new Date(to.getTime() - params.days * 86400_000)
  const hourly = generateHourly(params.area, from, to)
  const sums = new Array(24).fill(0)
  const counts = new Array(24).fill(0)
  for (const p of hourly) {
    const h = new Date(p.ts).getUTCHours()
    sums[h] += p.ore_per_kwh
    counts[h] += 1
  }
  return sums.map((s, h) => Math.round((s / Math.max(1, counts[h])) * 10) / 10)
}

// --- ROI: Battery ---
export interface BatteryRoi {
  area: PriceArea
  batteryKwh: number
  averageDailySavings: number // kr
  annualSavings: number // kr
  paybackYears: number
  efficiency: number
  notes: string
}

export function batteryRoi(params: {
  area: PriceArea
  batteryKwh: number
  batteryCostSek?: number
}): BatteryRoi {
  const batteryCost = params.batteryCostSek ?? 80_000
  const efficiency = 0.9
  const stats = getStats({
    area: params.area,
    from: new Date(Date.now() - 365 * 86400_000),
    to: new Date(),
  })
  const dailyVarianceKr = stats.averageDailyVarianceOre / 100
  const dailySavings = dailyVarianceKr * params.batteryKwh * efficiency
  const annual = dailySavings * 365
  return {
    area: params.area,
    batteryKwh: params.batteryKwh,
    averageDailySavings: Math.round(dailySavings * 100) / 100,
    annualSavings: Math.round(annual),
    paybackYears: Math.round((batteryCost / annual) * 10) / 10,
    efficiency,
    notes: `Based on average daily variance ${stats.averageDailyVarianceOre} öre/kWh in ${params.area} last 12 months.`,
  }
}

// --- ROI: Solar ---
export interface SolarRoi {
  area: PriceArea
  kwp: number
  annualProductionKwh: number
  selfUseShare: number
  surplusShare: number
  averageSpotKr: number
  annualRevenueSek: number
  paybackYears: number
}

const AREA_SOLAR_YIELD: Record<PriceArea, number> = {
  // kWh per kWp per year
  SE1: 850,
  SE2: 900,
  SE3: 980,
  SE4: 1050,
}

export function solarRoi(params: {
  area: PriceArea
  kwp: number
  orientation?: 'south' | 'east' | 'west' | 'north'
  systemCostAfterDeductionsSek?: number
}): SolarRoi {
  const orient = params.orientation ?? 'south'
  const orientFactor = orient === 'south' ? 1 : orient === 'east' || orient === 'west' ? 0.85 : 0.6
  const yieldPerKwp = AREA_SOLAR_YIELD[params.area] * orientFactor
  const annualProd = params.kwp * yieldPerKwp
  const selfUse = 0.4
  const surplus = 1 - selfUse
  const stats = getStats({
    area: params.area,
    from: new Date(Date.now() - 365 * 86400_000),
    to: new Date(),
  })
  const spotKr = stats.averageOre / 100
  const revenue = annualProd * (selfUse * (spotKr + 0.1) + surplus * (spotKr - 0.05))
  const cost = params.systemCostAfterDeductionsSek ?? 150_000
  return {
    area: params.area,
    kwp: params.kwp,
    annualProductionKwh: Math.round(annualProd),
    selfUseShare: selfUse,
    surplusShare: surplus,
    averageSpotKr: Math.round(spotKr * 100) / 100,
    annualRevenueSek: Math.round(revenue),
    paybackYears: Math.round((cost / revenue) * 10) / 10,
  }
}

// --- Smart EV charging ---
export interface SmartChargingResult {
  area: PriceArea
  annualKwh: number
  immediateCostSek: number
  smartCostSek: number
  annualSavingsSek: number
}

export function smartChargingSavings(params: {
  area: PriceArea
  annualKwh: number
}): SmartChargingResult {
  const curve = getAverageDailyCurve({ area: params.area, days: 365 })
  // Direct on arrival home: 17-22
  const directWindow = curve.slice(17, 23)
  const directAvg = directWindow.reduce((a, b) => a + b, 0) / directWindow.length
  // Smart charging: 23-06
  const smartWindow = [...curve.slice(23, 24), ...curve.slice(0, 6)]
  const smartAvg = smartWindow.reduce((a, b) => a + b, 0) / smartWindow.length
  const directKr = (directAvg / 100) * params.annualKwh
  const smartKr = (smartAvg / 100) * params.annualKwh
  return {
    area: params.area,
    annualKwh: params.annualKwh,
    immediateCostSek: Math.round(directKr),
    smartCostSek: Math.round(smartKr),
    annualSavingsSek: Math.round(directKr - smartKr),
  }
}
