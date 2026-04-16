import { prisma } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function getFileType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'IMAGE'
  if (mimeType === 'application/pdf') return 'PDF'
  return 'DOCUMENT'
}

function guessCategory(fileName: string): string {
  const lower = fileName.toLowerCase()
  if (lower.includes('tak') || lower.includes('roof')) return 'ROOF_PHOTO'
  if (lower.includes('panel') || lower.includes('elcentral') || lower.includes('electrical')) return 'ELECTRICAL_PANEL'
  if (lower.includes('parkering') || lower.includes('garage') || lower.includes('parking')) return 'PARKING'
  if (lower.includes('offert') || lower.includes('offer') || lower.includes('quote') || lower.includes('svea') || lower.includes('otovo') || lower.includes('solel') || lower.includes('solelkompaniet') || lower.includes('konkurrent')) return 'COMPETITOR_OFFER'
  if (lower.includes('faktura') || lower.includes('invoice') || lower.endsWith('.pdf')) return 'INVOICE'
  if (lower.includes('installation')) return 'INSTALLATION'
  return 'OTHER'
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string | null
    const category = formData.get('category') as string | null

    if (!file) {
      return Response.json({ error: 'No file attached' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'File is too large (max 10 MB)' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'File type not supported. Use JPG, PNG, WebP or PDF.' }, { status: 400 })
    }

    // Save file to disk
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const filePath = join(uploadsDir, uniqueName)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // Get base64 for image files (for vision API)
    let base64: string | undefined
    if (file.type.startsWith('image/')) {
      base64 = Buffer.from(bytes).toString('base64')
    }

    // Save to database
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        userId: userId || undefined,
        fileName: file.name,
        fileType: getFileType(file.type),
        filePath: `/uploads/${uniqueName}`,
        fileSize: file.size,
        category: category || guessCategory(file.name),
      },
    })

    return Response.json({
      id: uploadedFile.id,
      fileName: uploadedFile.fileName,
      filePath: uploadedFile.filePath,
      fileType: uploadedFile.fileType,
      category: uploadedFile.category,
      fileSize: uploadedFile.fileSize,
      base64,
      mimeType: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Uppladdning misslyckades' }, { status: 500 })
  }
}
