import { prisma } from '@/lib/db'

export async function GET() {
  const bundles = await prisma.bundle.findMany({
    where: { isActive: true },
    include: {
      products: {
        include: { product: true },
      },
    },
  })

  return Response.json(bundles)
}
