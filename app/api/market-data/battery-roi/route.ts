import { batteryRoi, type PriceArea } from '@/lib/marketData'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawArea = (searchParams.get('area') ?? 'SE3').replace(/[<>]/g, '').toUpperCase()
  const area = (['SE1', 'SE2', 'SE3', 'SE4'].includes(rawArea) ? rawArea : 'SE3') as PriceArea
  const batteryKwh = Number(searchParams.get('battery_kwh') ?? '10')
  const cost = searchParams.get('battery_cost_sek')
  return Response.json(
    batteryRoi({ area, batteryKwh, batteryCostSek: cost ? Number(cost) : undefined })
  )
}
