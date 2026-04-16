import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  if (slug) {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 })
    return Response.json(product)
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: { sortOrder: 'asc' },
  })

  return Response.json(products)
}
