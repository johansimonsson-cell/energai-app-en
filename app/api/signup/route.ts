import { prisma } from '@/lib/db'
import { hashSync } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, personalNumber, address, postalCode, city, password, planSlug, meterNumber } = body

    // Validation
    const errors: string[] = []

    if (!name?.trim()) errors.push('Name is required')
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email address')
    if (!password || password.length < 8) errors.push('Password must be at least 8 characters')
    if (personalNumber && !/^\d{8}-\d{4}$/.test(personalNumber)) errors.push('Personal number: YYYYMMDD-XXXX')
    if (!address?.trim()) errors.push('Address is required')

    if (errors.length > 0) {
      return Response.json({ error: errors.join('. ') }, { status: 400 })
    }

    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'Email address is already registered' }, { status: 409 })
    }

    // Determine price area from city
    let priceArea = 'SE3'
    const cityLower = (city || '').toLowerCase()
    if (['malmö', 'lund', 'helsingborg', 'kristianstad', 'ystad', 'trelleborg'].some(c => cityLower.includes(c))) {
      priceArea = 'SE4'
    } else if (['sundsvall', 'östersund', 'umeå', 'härnösand'].some(c => cityLower.includes(c))) {
      priceArea = 'SE2'
    } else if (['luleå', 'kiruna', 'gällivare', 'boden'].some(c => cityLower.includes(c))) {
      priceArea = 'SE1'
    }

    const fullAddress = `${address}${postalCode ? `, ${postalCode}` : ''}${city ? ` ${city}` : ''}`

    // Create user with address fields
    const user = await prisma.user.create({
      data: {
        email,
        password: hashSync(password, 10),
        name,
        phone,
        role: 'CUSTOMER',
        address,
        postalCode,
        city,
        priceArea,
      },
    })

    // Create electricity agreement if plan specified
    let agreement = null
    if (planSlug) {
      const product = await prisma.product.findUnique({ where: { slug: planSlug } })
      if (product && product.category === 'ELECTRICITY_PLAN') {
        const specs = product.specifications ? JSON.parse(product.specifications) : {}
        agreement = await prisma.electricityAgreement.create({
          data: {
            userId: user.id,
            productId: product.id,
            planType: specs.greenCertified ? 'GREEN' : (specs.bindingMonths > 0 ? 'FIXED' : 'VARIABLE'),
            pricePerKwh: product.basePrice,
            monthlyFee: specs.monthlyFee || 0,
            startDate: new Date(),
            bindingMonths: specs.bindingMonths || 0,
            status: 'PENDING',
            address: fullAddress,
            meterNumber: meterNumber || `SE-735999-${Date.now().toString().slice(-10)}`,
          },
        })
      }
    }

    // CRM note
    await prisma.cRMNote.create({
      data: {
        userId: user.id,
        type: 'CHAT',
        content: `New customer via AI chat.${agreement ? ` Signed electricity contract: ${planSlug}.` : ''} City: ${city || 'not specified'}, price area: ${priceArea}.`,
        createdBy: 'AI',
      },
    })

    return Response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      priceArea,
      agreement: agreement ? {
        id: agreement.id,
        planType: agreement.planType,
        status: agreement.status,
      } : null,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
