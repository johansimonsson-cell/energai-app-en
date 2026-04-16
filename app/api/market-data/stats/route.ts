import { getStats, type PriceArea } from '@/lib/marketData'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawArea = (searchParams.get('area') ?? 'SE3').replace(/[<>]/g, '').toUpperCase()
  const area = (['SE1', 'SE2', 'SE3', 'SE4'].includes(rawArea) ? rawArea : 'SE3') as PriceArea
  const period = searchParams.get('period') ?? 'last_12_months'

  const to = new Date()
  let from = new Date(to.getTime() - 365 * 86400_000)
  if (period === 'last_30_days') from = new Date(to.getTime() - 30 * 86400_000)
  if (period === 'last_24_months') from = new Date(to.getTime() - 730 * 86400_000)

  return Response.json({ ...getStats({ area, from, to }), source: 'demo' })
}
