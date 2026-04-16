import { solarRoi, type PriceArea } from '@/lib/marketData'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawArea = (searchParams.get('area') ?? 'SE3').replace(/[<>]/g, '').toUpperCase()
  const area = (['SE1', 'SE2', 'SE3', 'SE4'].includes(rawArea) ? rawArea : 'SE3') as PriceArea
  const kwp = Number(searchParams.get('kwp') ?? '10')
  const orientation = (searchParams.get('roof_orientation') ?? 'south') as
    | 'south'
    | 'east'
    | 'west'
    | 'north'
  return Response.json(solarRoi({ area, kwp, orientation }))
}
