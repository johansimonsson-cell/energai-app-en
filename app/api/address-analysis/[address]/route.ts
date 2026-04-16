import { getMockAddressAnalysis } from '@/lib/ai/mockAnalysis'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params
    const decodedAddress = decodeURIComponent(address)

    if (!decodedAddress || decodedAddress.length < 3) {
      return Response.json({ error: 'Please enter a valid address' }, { status: 400 })
    }

    const analysis = getMockAddressAnalysis(decodedAddress)

    return Response.json(analysis)
  } catch (error) {
    console.error('Address analysis error:', error)
    return Response.json({ error: 'Could not analyze the address' }, { status: 500 })
  }
}
