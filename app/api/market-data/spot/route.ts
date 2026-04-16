import { getSpot, type Granularity, type PriceArea } from '@/lib/marketData'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawArea = (searchParams.get('area') ?? 'SE3').replace(/[<>]/g, '').toUpperCase()
  const area = (['SE1', 'SE2', 'SE3', 'SE4'].includes(rawArea) ? rawArea : 'SE3') as PriceArea
  const fromStr = searchParams.get('from')
  const toStr = searchParams.get('to')
  const granularity = (searchParams.get('granularity') ?? 'day') as Granularity

  const to = toStr ? new Date(toStr) : new Date()
  const from = fromStr ? new Date(fromStr) : new Date(to.getTime() - 30 * 86400_000)

  const data = getSpot({ area, from, to, granularity })
  return Response.json({
    area,
    from: from.toISOString(),
    to: to.toISOString(),
    granularity,
    points: data,
    source: 'demo',
  })
}
