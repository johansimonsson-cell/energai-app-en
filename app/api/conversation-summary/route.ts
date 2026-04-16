import { prisma } from '@/lib/db'

interface SummaryRequest {
  sessionId: string
}

export async function POST(request: Request) {
  try {
    const body: SummaryRequest = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'sessionId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    })

    // Extract key information from the conversation
    const userMessages = messages
      .filter(m => m.role === 'USER')
      .map(m => m.content)

    const assistantMessages = messages
      .filter(m => m.role === 'ASSISTANT')
      .map(m => {
        // Strip CONTENT_ACTION blocks
        return m.content.replace(/<!--CONTENT_ACTION-->[\s\S]*?<!--\/CONTENT_ACTION-->/g, '').trim()
      })

    // Identify needs from user messages
    const identifiedNeeds: string[] = []
    const allUserText = userMessages.join(' ').toLowerCase()

    if (allUserText.includes('solcell') || allUserText.includes('solar') || allUserText.includes('sol ')) identifiedNeeds.push('Solar panels')
    if (allUserText.includes('batteri') || allUserText.includes('battery') || allUserText.includes('lagr')) identifiedNeeds.push('Battery')
    if (allUserText.includes('laddstolpe') || allUserText.includes('charger') || allUserText.includes('laddbox') || allUserText.includes('elbil') || allUserText.includes('ev')) identifiedNeeds.push('Charger/EV')
    if (allUserText.includes('elavtal') || allUserText.includes('electricity') || allUserText.includes('elpris') || allUserText.includes('elräkning')) identifiedNeeds.push('Electricity contract')
    if (allUserText.includes('faktura') || allUserText.includes('invoice') || allUserText.includes('betala') || allUserText.includes('bill')) identifiedNeeds.push('Invoice question')
    if (allUserText.includes('flytt') || allUserText.includes('moving')) identifiedNeeds.push('Moving contract')
    if (allUserText.includes('strömavbrott') || allUserText.includes('outage') || allUserText.includes('ström')) identifiedNeeds.push('Power outage')

    // Extract mentioned details
    const details: string[] = []
    const kwhMatch = allUserText.match(/(\d[\d\s]*)\s*kwh/i)
    if (kwhMatch) details.push(`Consumption: ${kwhMatch[1].replace(/\s/g, '')} kWh`)

    const costMatch = allUserText.match(/(\d[\d\s]*)\s*kr/i)
    if (costMatch) details.push(`Mentioned amount: ${costMatch[1].replace(/\s/g, '')} kr`)

    if (allUserText.includes('stockholm')) details.push('Location: Stockholm (SE3)')
    else if (allUserText.includes('göteborg') || allUserText.includes('gothenburg')) details.push('Location: Gothenburg (SE3)')
    else if (allUserText.includes('malmö')) details.push('Location: Malmö (SE4)')

    if (allUserText.includes('villa') || allUserText.includes('hus') || allUserText.includes('house')) details.push('Housing: Detached house')
    if (allUserText.includes('radhus') || allUserText.includes('townhouse')) details.push('Housing: Townhouse')
    if (allUserText.includes('söder') || allUserText.includes('south')) details.push('Roof: South-facing')

    // Build summary
    const conversationSummary = [
      `Conversation with ${messages.length} messages.`,
      identifiedNeeds.length > 0 ? `Identified needs: ${identifiedNeeds.join(', ')}.` : '',
      details.length > 0 ? `Details: ${details.join('. ')}.` : '',
      `Latest topic: ${userMessages.length > 0 ? userMessages[userMessages.length - 1].substring(0, 100) : 'None'}`,
    ].filter(Boolean).join(' ')

    // Get user info if session has a userId
    let customerInfo = null
    if (session.userId) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, email: true, phone: true, address: true, city: true, priceArea: true },
      })
      if (user) customerInfo = user
    }

    const result = {
      sessionId,
      conversationSummary,
      identifiedNeeds,
      details,
      customerInfo,
      messageCount: messages.length,
      lastActivity: messages.length > 0 ? messages[messages.length - 1].createdAt : null,
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Conversation summary error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
