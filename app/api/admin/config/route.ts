import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const configs = await prisma.adminConfig.findMany()
    const configMap: Record<string, unknown> = {}
    for (const c of configs) {
      try {
        configMap[c.key] = JSON.parse(c.value)
      } catch {
        configMap[c.key] = c.value
      }
    }
    return Response.json(configMap)
  } catch (error) {
    console.error('Admin config fetch error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json() as Record<string, unknown>

    const results = await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.adminConfig.upsert({
          where: { key },
          update: {
            value: typeof value === 'string' ? value : JSON.stringify(value),
            updatedBy: 'admin',
          },
          create: {
            key,
            value: typeof value === 'string' ? value : JSON.stringify(value),
            updatedBy: 'admin',
          },
        })
      )
    )

    return Response.json({ updated: results.length })
  } catch (error) {
    console.error('Admin config update error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
