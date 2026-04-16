import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/db'
import { buildSystemPrompt, type SystemPromptConfig } from '@/lib/ai/buildSystemPrompt'
import { rateLimit } from '@/lib/rateLimit'
import { getMockImageAnalysis } from '@/lib/ai/mockAnalysis'

let _anthropic: Anthropic | null = null
function getAnthropic() {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _anthropic
}

interface ChatRequest {
  message: string
  sessionId: string | null
  context: {
    view: string
    data: Record<string, unknown>
  }
  userId?: string | null
  attachments?: {
    id: string
    fileName: string
    fileType: string
    category: string | null
    base64?: string
    mimeType?: string
  }[]
}

async function getAllAdminConfig() {
  const rows = await prisma.adminConfig.findMany()
  const config: Record<string, unknown> = {}
  for (const row of rows) {
    try {
      config[row.key] = JSON.parse(row.value)
    } catch {
      config[row.key] = row.value
    }
  }
  return config
}

async function getOrCreateSession(sessionId: string | null, userId: string | null) {
  if (sessionId) {
    const existing = await prisma.chatSession.findUnique({ where: { id: sessionId } })
    if (existing) return existing
  }

  return prisma.chatSession.create({
    data: {
      userId: userId || undefined,
      context: JSON.stringify({ view: 'welcome' }),
    },
  })
}

async function getSessionMessages(sessionId: string) {
  return prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: 50,
  })
}

async function getUserData(userId: string | null) {
  if (!userId) return { user: null, agreements: [], hardwareOrders: [], crmNotes: [] }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { user: null, agreements: [], hardwareOrders: [], crmNotes: [] }

  const [agreements, hardwareOrders, crmNotes] = await Promise.all([
    prisma.electricityAgreement.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      include: { product: true },
    }),
    prisma.hardwareOrder.findMany({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    }),
    prisma.cRMNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return { user, agreements, hardwareOrders, crmNotes }
}

async function getProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

async function getBundles() {
  return prisma.bundle.findMany({
    where: { isActive: true },
    include: { products: { include: { product: true } } },
  })
}

async function getFinancingOptions() {
  return prisma.financingOption.findMany({ where: { isActive: true } })
}

async function getActiveOffers() {
  return prisma.offer.findMany({
    where: {
      isActive: true,
      OR: [
        { validUntil: { gte: new Date() } },
        { validUntil: null },
      ],
    },
    include: { products: { include: { product: true } } },
  })
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
    const { allowed } = rateLimit(ip, { maxRequests: 20, windowMs: 60_000 })
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }

    const body: ChatRequest = await request.json()
    const { message, sessionId, context, userId, attachments } = body

    // Gather all data in parallel
    const [
      adminConfigRaw,
      session,
      { user, agreements, hardwareOrders, crmNotes },
      products,
      bundlesRaw,
      financingOptions,
      offers,
    ] = await Promise.all([
      getAllAdminConfig(),
      getOrCreateSession(sessionId, userId || null),
      getUserData(userId || null),
      getProducts(),
      getBundles(),
      getFinancingOptions(),
      getActiveOffers(),
    ])

    // Get conversation history
    const history = await getSessionMessages(session.id)

    // Handle attachments — mock analysis in prototype
    // Detect competitor offers from context: filename, user message, or explicit category
    let imageAnalysisContext = ''
    if (attachments && attachments.length > 0) {
      const msgLower = message.toLowerCase()
      const isCompetitorContext = msgLower.includes('quote') || msgLower.includes('competitor')
        || msgLower.includes('compare') || msgLower.includes('match')
        || msgLower.includes('svea') || msgLower.includes('otovo') || msgLower.includes('solelkompaniet')
        || msgLower.includes('offert') || msgLower.includes('konkurrent')

      for (const attachment of attachments) {
        // Override category to COMPETITOR_OFFER if context suggests it
        const effectiveCategory = isCompetitorContext ? 'COMPETITOR_OFFER' : (attachment.category || 'OTHER')
        const analysis = getMockImageAnalysis(effectiveCategory)
        imageAnalysisContext += `\n\n[ANALYSIS for "${attachment.fileName}" (${effectiveCategory})]:\n${JSON.stringify(analysis, null, 2)}`

        if (effectiveCategory === 'COMPETITOR_OFFER') {
          imageAnalysisContext += `\n\nINSTRUCTION: You now have an extracted competitor quote. Show IMMEDIATELY competitor-comparison phase 1 with the extracted data in CONTENT_ACTION. Copy the competitor object straight into the data field. Then ask the customer to confirm the details are correct.`
        }

        // Update UploadedFile with analysis if it exists
        if (attachment.id) {
          await prisma.uploadedFile.update({
            where: { id: attachment.id },
            data: { aiAnalysis: JSON.stringify(analysis) },
          }).catch(() => {})
        }
      }
    }

    // Save user message to DB
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content: message + (imageAnalysisContext ? `\n${imageAnalysisContext}` : ''),
        contentPanelState: JSON.stringify(context),
      },
    })

    // Build system prompt config
    const systemPromptConfig: SystemPromptConfig = {
      adminConfig: adminConfigRaw as SystemPromptConfig['adminConfig'],
      isAuthenticated: !!user,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        city: user.city,
        priceArea: user.priceArea,
        annualConsumptionKwh: user.annualConsumptionKwh,
      } : null,
      currentAgreements: agreements.map(a => ({
        planType: a.planType,
        pricePerKwh: a.pricePerKwh,
        monthlyFee: a.monthlyFee,
        status: a.status,
        address: a.address,
        productName: a.product?.name,
      })),
      hardwareOrders: hardwareOrders.map(o => ({
        id: o.id,
        status: o.status,
        totalPrice: o.totalPrice,
        netPrice: o.netPrice,
        financingType: o.financingType,
        monthlyPayment: o.monthlyPayment,
        installationDate: o.installationDate,
        items: o.items.map(i => ({ productName: i.product.name, quantity: i.quantity })),
      })),
      currentView: context?.view || 'welcome',
      products: products.map(p => ({
        slug: p.slug,
        category: p.category,
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        basePrice: p.basePrice,
        priceType: p.priceType,
        specifications: p.specifications,
        eligibleForRot: p.eligibleForRot,
        eligibleForGreenDeduction: p.eligibleForGreenDeduction,
        greenDeductionPercent: p.greenDeductionPercent,
        installationIncluded: p.installationIncluded,
        installationTimeWeeks: p.installationTimeWeeks,
        warrantyYears: p.warrantyYears,
      })),
      bundles: bundlesRaw.map(b => ({
        name: b.name,
        description: b.description,
        bundleDiscount: b.bundleDiscount,
        products: b.products.map(bp => ({
          name: bp.product.name,
          slug: bp.product.slug,
          category: bp.product.category,
          basePrice: bp.product.basePrice,
        })),
      })),
      financingOptions: financingOptions.map(f => ({
        name: f.name,
        type: f.type,
        interestRatePercent: f.interestRatePercent,
        availableTermsMonths: f.availableTermsMonths,
        minAmount: f.minAmount,
        maxAmount: f.maxAmount,
      })),
      availableOffers: offers.map(o => ({
        id: o.id,
        name: o.name,
        description: o.description,
        discountPercent: o.discountPercent,
        discountType: o.discountType,
        targetSegment: o.targetSegment,
      })),
      recentCRMNotes: crmNotes.map(n => ({
        type: n.type,
        content: n.content,
        createdAt: n.createdAt,
      })),
      hasAttachments: !!(attachments && attachments.length > 0),
    }

    const systemPrompt = buildSystemPrompt(systemPromptConfig)

    // Build messages array for Claude
    const claudeMessages: Anthropic.MessageParam[] = history.map((msg) => ({
      role: msg.role === 'USER' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }))

    // Build user message content — text + optional images via vision
    const userText = message + (imageAnalysisContext ? `\n\nImage analysis results (from system):\n${imageAnalysisContext}` : '')

    if (attachments && attachments.some(a => a.base64 && a.mimeType?.startsWith('image/'))) {
      const contentParts: Anthropic.ContentBlockParam[] = []

      for (const att of attachments) {
        if (att.base64 && att.mimeType?.startsWith('image/')) {
          contentParts.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: att.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: att.base64,
            },
          })
        }
      }

      contentParts.push({ type: 'text', text: userText })
      claudeMessages.push({ role: 'user', content: contentParts })
    } else {
      claudeMessages.push({ role: 'user', content: userText })
    }

    // Stream response from Claude
    const encoder = new TextEncoder()
    let fullResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const claudeStream = getAnthropic().messages.stream({
            model: 'claude-sonnet-4-6-20250514',
            max_tokens: 4096,
            system: systemPrompt,
            messages: claudeMessages,
          })

          for await (const event of claudeStream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const text = event.delta.text
              fullResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }

          // Save assistant response to DB
          await prisma.chatMessage.create({
            data: {
              sessionId: session.id,
              role: 'ASSISTANT',
              content: fullResponse,
              contentPanelState: extractContentAction(fullResponse),
            },
          })

          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          const errorMsg = 'Something went wrong with the AI service. Please try again in a moment.'
          fullResponse = errorMsg
          controller.enqueue(encoder.encode(errorMsg))

          await prisma.chatMessage.create({
            data: {
              sessionId: session.id,
              role: 'ASSISTANT',
              content: fullResponse,
            },
          }).catch(() => {})

          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Session-Id': session.id,
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function extractContentAction(text: string): string | null {
  const match = text.match(/<!--CONTENT_ACTION-->([\s\S]*?)<!--\/CONTENT_ACTION-->/)
  if (!match) return null
  try {
    JSON.parse(match[1].trim())
    return match[1].trim()
  } catch {
    return null
  }
}
