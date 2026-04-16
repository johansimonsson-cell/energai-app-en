import { smartChargingSavings, type PriceArea } from '@/lib/marketData'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = (searchParams.get('area') ?? 'SE3') as PriceArea
  const annualKwh = Number(searchParams.get('annual_kwh') ?? '2500')
  return Response.json(smartChargingSavings({ area, annualKwh }))
}
